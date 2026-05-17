import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        // 1. Проверяем, вошел ли админ при обновлении страницы
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // 2. Слушаем изменения (если ты вошел или вышел)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Ошибка входа: ' + error.message);
        } else {
            alert('Успешно! Теперь вы Админ.');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // Если админ УЖЕ ВОШЕЛ — показываем зеленую плашку и кнопку выхода
    if (session) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                    <span className="text-sm font-bold">👑 Режим Админа</span>
                    <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition">Выйти</button>
                </div>
            </div>
        );
    }

    // Если НЕ ВОШЕЛ — показываем форму логина
    return (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-700 w-64">
            <h3 className="text-white text-sm font-bold mb-3">Вход в Админку</h3>
            <input
                type="email"
                placeholder="Твой Email из Supabase"
                className="block w-full mb-2 p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm focus:outline-none focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Твой Пароль"
                className="block w-full mb-3 p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm focus:outline-none focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white font-bold rounded p-2 text-sm hover:bg-blue-500 transition"
            >
                Войти
            </button>
        </div>
    );
};