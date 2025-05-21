import { titleFont } from "@/config/fonts"
import { RegisterForm } from "./ui/RegisterForm"
import { ParticlesBg } from "@/components"

export default function () {
  return (
    <main className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${titleFont.className} text-4xl mb-5`}>Nueva Cuenta</h1>
      <span className="z-10">
        <RegisterForm />
      </span>
      <span className="z-0">
        <ParticlesBg />
      </span>
    </main>
  )
}
