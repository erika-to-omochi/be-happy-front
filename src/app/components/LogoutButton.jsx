import { useRouter } from 'next/navigation';

function LogoutButton({ setIsLoggedIn }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // トークンを削除
    localStorage.removeItem('name'); // 名前を削除
    setIsLoggedIn(false); // ログアウト状態を更新

    // カスタムイベントを発行してログアウト状態を通知
    window.dispatchEvent(new Event('logout'));

    // ログアウトメッセージをlocalStorageに一時的に保存
    localStorage.setItem('logoutMessage', 'ログアウトしました');

    // ホームページにリダイレクト
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 rounded"
    >
      ログアウト
    </button>
  );
}

export default LogoutButton;
