import { Toaster } from "sonner";

const ToastProvider = ({ children }: {
    children: React.ReactNode;
}) => {
  return (
    <>
      {children}
      <Toaster position="top-center" 
      closeButton
      className="z-[500]"
      />
    </>
  )
};

export default ToastProvider;
