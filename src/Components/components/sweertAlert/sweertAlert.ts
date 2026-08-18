import Swal, { SweetAlertIcon } from "sweetalert2";

//prettier-ignore
export const alertglobal = (tittle: string, text: string, icon: SweetAlertIcon) => {
  Swal.fire({
    icon: icon,
    title: tittle,
    text: text,
    confirmButtonText: "Ok",
  }).then(() => {
    //definir para recargar pagina no utilizar 
    // window.location.reload();  
  });
};

//prettier-ignore
export const AlertGlobalOptions = async (title: string, acceptText: string, denyText?: string, icon?: SweetAlertIcon): Promise<boolean> => {
  try {
    const response = await Swal.fire({
      icon: icon ? icon : 'warning',
      title: title,
      showDenyButton: true,
      confirmButtonText: acceptText,
      denyButtonText: denyText,
    });

    if (response.isConfirmed) {
      return true;
    } else if (response.isDenied) {
      return false;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

//prettier-ignore
export const AlertGlobalTrue = async (title: string, acceptText: string, icon?: SweetAlertIcon): Promise<boolean> => {
  try {
   await Swal.fire({
      icon: icon ? icon : 'warning',
      title: title,
      confirmButtonText: acceptText,
    });
    return true;
  } catch (error) {
    return false;
  }
};
