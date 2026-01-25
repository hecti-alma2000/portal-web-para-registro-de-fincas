'use client';
import { userChangeRole } from '@/actions/user/user-change-role';
import type { User } from '@/interfaces/user.interface';

interface Props {
  users: User[];
}

export const UsersTable = ({ users }: Props) => {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 dark:bg-zinc-800 border-b dark:border-zinc-700">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 dark:text-gray-100 px-6 py-4 text-left"
          >
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 dark:text-gray-100 px-6 py-4 text-left"
          >
            Nombre completo
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 dark:text-gray-100 px-6 py-4 text-left"
          >
            Role
          </th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr
            key={user.id}
            className="bg-white dark:bg-zinc-900 border-b transition duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.email}
            </td>
            <td className="text-sm dark:text-gray-100 text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {user.name}
            </td>
            <td className="text-sm dark:text-gray-100 text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              <select
                value={user.role.toString()}
                className={
                  `text-sm w-full p-2 transition-colors ` +
                  (user.isPrimary
                    ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-zinc-700'
                    : 'text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700')
                }
                onChange={(e) => !user.isPrimary && userChangeRole(user.id, e.target.value)}
                disabled={!!user.isPrimary}
                title={user.isPrimary ? 'Usuario principal - no se puede cambiar el role' : ''}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
