import { useFormikContext } from "formik";
import { useEffect } from "react";

/**
 * Component to help use formik.
 */
export default function FormikHelper(props: { onChange?: Function }) {
  const { values } = useFormikContext();
  useEffect(() => {
    props.onChange?.(values);
  }, [values]);

  return <></>;
}
