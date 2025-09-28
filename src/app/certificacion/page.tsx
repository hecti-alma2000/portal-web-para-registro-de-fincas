// app/certificacion/page.tsx

import { CertificacionForm } from "@/components/ui/CertificacionForm";


/**
 * Página principal del Sistema de Certificación de Fincas.
 * Usa un componente de cliente para la interactividad y SweetAlert2.
 */
export default function CertificacionPage() {
    return (
        <div className="py-12 px-4 min-h-screen">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Diagnóstico de Potencial Agroturístico
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Responde este cuestionario y obtén una evaluación inmediata de tu finca.
                </p>
            </header>
            
            <CertificacionForm />
        </div>
    );
}