import Swal from 'sweetalert2/dist/sweetalert2.js'
export const swalTost  = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-info me-2 btn-sm",
      cancelButton: "btn btn-danger btn-sm",
      denyButton : "btn btn-danger btn-sm"
    },
    showCancelButton: true,
    buttonsStyling: false,
    backdrop:`rgba(255,229,241,0.26)`,
    confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
    cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
});

export const swal  = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-info me-2 btn-sm",
      cancelButton: "btn btn-danger btn-sm",
      denyButton : "btn btn-danger btn-sm"
    },
    buttonsStyling: false,
    showCancelButton: false,
    backdrop:`rgba(255,229,241,0.26)`,
});