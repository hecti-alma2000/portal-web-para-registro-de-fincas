export const revalidate = 0;

import { getPaginatedUser } from '@/actions/user/get-paginated-users';
import { UsersTable } from './ui/UsersTable';
import { Title } from '@/components/ui/Title';
import { redirect } from 'next/navigation';

export default async function () {
  const { ok, users = [] } = await getPaginatedUser();
  if (!ok) {
    redirect('/');
  }
  return (
    <>
      <Title title="Mantenimiento de usuarios" />
      <UsersTable users={users} />
      <div className="mb-10"></div>
    </>
  );
}
