type ErrorFormProps = {
  error?: string;
};

export default function ErrorForm({ error }: ErrorFormProps) {
    return (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">

                    {/* Icône */}
                    <div className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-400 flex-shrink-0">
                        <span className="text-red-500 font-bold text-sm">!</span>
                    </div>

                    {/* Texte */}
                    <div>
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    </div>

                </div>
            
        
    );
}