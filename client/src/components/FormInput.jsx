const FormInput = ({ label, icon, error, className = "", ...props }) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-indigo-200/90">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full bg-white/10 border border-gray-600 text-black placeholder-indigo-300/60
            rounded-2xl py-3.5 px-4 ${icon ? "pl-12" : "px-5"}
            focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30
            transition-all duration-200 ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-red-400 text-sm mt-1.5">{error}</p>}
        </div>
    );
};

export default FormInput;