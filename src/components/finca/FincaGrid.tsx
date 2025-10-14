import { Finca } from '@prisma/client';
import { FincaGridItem } from './FincaGridItem';

interface Props {
  fincas: Finca[];
}

export const FincaGrid = ({ fincas }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
      {fincas.map((finca) => (
        <FincaGridItem key={finca.id} finca={finca} />
      ))}
    </div>
  );
};
