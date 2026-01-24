export const CertificacionContent = () => (
  <div className="p-6 shadow-lg rounded-xl prose dark:prose-invert max-w-none bg-white text-black dark:bg-zinc-900 dark:text-white">
    <div className="animate__animated animate__lightSpeedInLeft flex flex-col justify-center">
      <h2 className="mb-4 text-center text-2xl font-semibold md:text-left">
        ¿En qué consiste nuestro sistema de certificación?
      </h2>

      <p className="text-justify leading-relaxed">
        Nuestro sistema de certificación se basa en el
        <b className="text-blue-600 dark:text-blue-400 font-extrabold">
          {' '}
          índice de Finca con Potencial Agroturístico (FPAT)
        </b>
        , una herramienta que valora la
        <b className="text-blue-600 dark:text-blue-400"> viabilidad y calidad</b> de tu propiedad
        rural como destino turístico. El índice de
        <b className="text-blue-600 dark:text-blue-400"> FPAT</b> utiliza un
        <b className="text-green-600 dark:text-green-400"> sistema de puntaje ponderado</b> para
        evaluar 11 criterios clave asociados a las dimensiones del desarrollo territorial,
        incluyendo <b className="text-green-600 dark:text-green-400"> sustentabilidad agrícola</b>,
        infraestructura y accesibilidad. La calificación final determina si la finca es
        <b className="text-red-600 dark:text-red-400"> APTA</b>, certificando su sólido
        <b className="text-red-600 dark:text-red-400"> potencial agroturístico</b> y ofreciendo una
        guía para el desarrollo sostenible.
      </p>
    </div>
  </div>
);
