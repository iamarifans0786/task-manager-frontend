import { useFormContext } from "react-hook-form";

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", placeholder }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <label className="block text-sm md:text-base font-medium text-white">
                {label}
            </label>
            <input
                type={type}
                {...register(name)}
                placeholder={placeholder}
                className="input !outline-none"
            />
            {errors[name] && (
                <p className="error">{(errors[name]?.message as string) || "Invalid input"}</p>
            )}
        </div>
    );
};

export default InputField;
