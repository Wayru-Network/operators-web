import { Tooltip } from "@heroui/tooltip";

interface CustomInputProps {
  label: string;
  helper?: string;
  placeholder?: string;
  inputClass?: string;
  wrapperClass?: string;
  labelClass?: string;
  helperClass?: string;
  validSubscription?: boolean;
}

export function CustomInput(
  props: CustomInputProps & React.InputHTMLAttributes<HTMLInputElement>
) {
  const {
    label,
    helper,
    placeholder = "",
    inputClass = "",
    wrapperClass = "",
    labelClass = "",
    helperClass = "",
    ...rest
  } = props;
  return (
    <Tooltip
      content="You need to have a premium plan to set a redirect URL."
      placement="top"
      isDisabled={props.validSubscription}
      className="w-full"
      color="warning"
    >
      <div className={`relative w-full ${wrapperClass}`}>
        <input
          {...rest}
          placeholder={placeholder}
          className={`w-full rounded-[4px] border-2 border-neutral-300
          bg-transparent px-4 pt-4 pb-4 text-lg outline-none peer
          focus:border-[#751CF6] disabled:text-neutral-600 disabled:border-neutral-600 ${inputClass}`}
          maxLength={50}
          disabled={!props.validSubscription}
        />
        <label
          className={`absolute bg-[#ffffff] dark:bg-[#191c1d] px-2 w-fit left-3 -top-3 peer-focus:text-[#363438] ${labelClass}`}
        >
          {label}
        </label>
        {helper && (
          <p className={`mt-1 text-sm text-neutral-500 ${helperClass}`}>
            {helper}
          </p>
        )}
      </div>
    </Tooltip>
  );
}
