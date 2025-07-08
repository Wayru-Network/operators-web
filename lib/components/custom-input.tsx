interface CustomInputProps {
  label: string;
  helper?: string;
  placeholder?: string;
  inputClass?: string;
  wrapperClass?: string;
  labelClass?: string;
  helperClass?: string;
}

export function CustomInput(
  props: CustomInputProps & React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <div className={`relative w-full ${props.wrapperClass}`}>
      <input
        placeholder={props.placeholder}
        className={`w-full rounded-[4px] border-2 border-neutral-300
                    bg-transparent px-4 pt-4 pb-4 text-lg outline-none peer
                    focus:border-[#751CF6] ${props.inputClass}`}
      />
      <label
        className={`absolute bg-[#ffffff] dark:bg-[#191c1d] px-2 w-fit left-3 -top-3 peer-focus:text-[#751CF6] ${props.labelClass}`}
      >
        {props.label}
      </label>
      {props.helper && (
        <p className={`mt-1 text-sm text-neutral-500 ${props.helperClass}`}>
          {props.helper}
        </p>
      )}
    </div>
  );
}
