import { getCountry, getFlagUrl } from '@/lib/countries';

interface CountryFlagProps {
  code?: string | null;
  className?: string;
  /** Muestra el nombre del país junto a la bandera */
  withName?: boolean;
}

export const CountryFlag = ({ code, className = 'w-5 h-auto', withName = false }: CountryFlagProps) => {
  const country = getCountry(code);
  const flag = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getFlagUrl(country.code)}
      alt={`Bandera de ${country.name}`}
      title={country.name}
      className={`inline-block rounded-[2px] shadow-sm ring-1 ring-black/10 ${className}`}
      loading="lazy"
    />
  );

  if (!withName) return flag;

  return (
    <span className="inline-flex items-center gap-1.5">
      {flag}
      <span>{country.name}</span>
    </span>
  );
};
