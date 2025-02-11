import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProtectedLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const { token } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!token) {
      e.preventDefault(); // Impede a navegação

      Swal.fire({
        title: 'Acesso Negado',
        text: 'Você precisa estar logado para acessar esta página.',
        icon: 'warning',
        confirmButtonText: 'Ir para o Login',
        confirmButtonColor: '#004022', // Cor do botão
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login'); // Redireciona para o login
        }
      });
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default ProtectedLink;