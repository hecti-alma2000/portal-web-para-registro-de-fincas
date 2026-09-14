import Swal from 'sweetalert2';

// Instancia de SweetAlert2 con la identidad visual del sitio (verde,
// bordes redondeados, soporte de modo oscuro). Los estilos base de las
// clases `swal-brand-*` viven en globals.css. Usar esta instancia en vez
// de importar 'sweetalert2' directamente para que todos los popups del
// sistema luzcan consistentes.
const themedSwal = Swal.mixin({
  confirmButtonColor: '#16a34a',
  cancelButtonColor: '#71717a',
  buttonsStyling: true,
  customClass: {
    popup: 'swal-brand-popup',
    title: 'swal-brand-title',
    htmlContainer: 'swal-brand-text',
    confirmButton: 'swal-brand-confirm',
    cancelButton: 'swal-brand-cancel',
  },
});

export default themedSwal;
