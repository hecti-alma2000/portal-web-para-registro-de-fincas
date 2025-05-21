export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  // si el total de pag es 7 o menos, se muestran las pag sin [...]
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1); // [1,2,3,4,5,6,7]
  }
  //si la pag actual esta entre las 3 primeras, mostrar las tres primeras, [...] y las ultimas 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]; //[1 2 3 ... penultima ultima]
  }
  // si la pag actual esta / las ultimas 3, mostrar las 2 primeras [...] y las ultimas 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]; //[1 2 ... auntepenultima penultima ultima]
  }
  // si la pag actual esta en el ,medio, mostrar la primera [..] la actaul y vecinos

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
