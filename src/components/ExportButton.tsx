import ExcelJS from 'exceljs';
import { Product } from '../models';

interface ExportToExcelProps {
    products: Product[];
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ products }) => {
    const exportToExcel = async () => {
        if (!products || products.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventário');

        // Configuração das colunas
        worksheet.columns = [
            { header: 'ID', key: 'id' },
            { header: 'Nome', key: 'name' },
            { header: 'Categoria', key: 'category' },
            { header: 'Modelo', key: 'model' },
            { header: 'Marca', key: 'brand' },
            { header: 'Descrição', key: 'description' },
            { header: 'Quantidade', key: 'quantity' },
            { header: 'Tamanho', key: 'size' },
            { header: 'Lote', key: 'lot' },
            { header: 'Setor', key: 'sector' },
            { header: 'Entregue por', key: 'deliveredBy' },
            { header: 'Retirado por', key: 'removedBy' }, // Nova coluna
            { header: 'Recebido por', key: 'receivedBy' },
            { header: 'Empresa Recebedora', key: 'receivedCompany' },
            { header: 'Empresa Atual', key: 'currentCompany' },
            { header: 'Assinatura', key: 'signature' },
            { header: 'Data de Recebimento', key: 'receiptDate' },
            { header: 'Horário', key: 'receiptTime' }, // Nova coluna
            { header: 'Última Alteração', key: 'lastUpdate' } // Nova coluna
        ];

        // Estilo do cabeçalho
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '92D050' }
            };
            cell.font = {
                name: 'Arial',
                size: 12,
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Adicionar dados
        products.forEach((product, index) => {
            const receiptDate = product.date_receipt ? new Date(product.date_receipt) : null;

            worksheet.addRow({
                id: index + 1, // ID numérico sequencial
                name: product.name,
                category: product.category,
                model: product.model,
                brand: product.company_brand,
                description: product.description,
                quantity: product.quantity,
                size: product.size,
                lot: product.lot ? 'Sim' : 'Não',
                sector: product.sector,
                deliveredBy: product.delivered_by,
                removedBy: product.delivered_by || 'N/A', // Supondo novo campo
                receivedBy: `${product.received_by?.first_name} ${product.received_by?.last_name}`,
                receivedCompany: product.received_company?.name || '',
                currentCompany: product.current_company?.name || '',
                signature: product.delivery_man_signature || 'N/A',
                receiptDate: receiptDate ? receiptDate.toLocaleDateString('pt-BR') : "",
                receiptTime: receiptDate ? receiptDate.toLocaleTimeString('pt-BR') : "", // Horário formatado
                lastUpdate: receiptDate ? receiptDate.toLocaleString('pt-BR') : "" // Data+hora da última alteração
            });
        });

        // Autoajuste de colunas com limites
        worksheet.columns.forEach(column => {
            if (column.eachCell) {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const cellValue = cell.value ? cell.value.toString() : '';
                    const cellLength = Math.min(cellValue.length + 3, 50); // Máximo de 50 caracteres
                    maxLength = Math.max(maxLength, cellLength);
                });
                column.width = maxLength;
            }
        });

        // Aplicar bordas e estilos em todas as células
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };

                if (rowNumber > 1) {
                    cell.font = { name: 'Arial', size: 11 };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
            });
        });

        // Gerar e salvar arquivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
    };

    return (
        <button
            onClick={exportToExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
        >
            📄 Exportar Planilha Completa
        </button>
    );
};

export default ExportToExcel;