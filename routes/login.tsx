import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function Login() {
  return (
    <>
      <Head>
        <title>WorkflowS Login</title>
      </Head>
      <div class="fresh-gradient flex flex-col items-center justify-center min-h-screen p-6">
        <div class="w-full max-w-md">
          <div class="flex justify-center items-center gap-4 mb-8">
            <img alt="WorkflowS Logo" class="h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjsqfqwDZ252tpcQ5BaU7PoA3YNSW6ky0z9hQey_mDIREv-cdkjrt-RKJsXT3msMrjIxzmq49R6PgXuzPpYGsq3FFUuArKGHSOCLPyM_RI3VlEMFLD3fc_2zbcGDx9N05n6YMBBmGChTcJZXS0ROhEsDxBj-fTKr9vbW2FbwTD1aRgRxakJhWriv8bwxb3-3gHgTsNwhm8cMhe60YRkZU6LxxAtO7Zql3fCxWIjz6IJWtAisJwO-9W0abgpFlb6UtUf7jOZhxPRCLC" />
            <img alt="Universidad La Salle Logo" class="h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6fMylsoLD5bqSYyw5Y0aNKl-DmuxKV5xWM_QBTfrra-gca_ujHkAFTZvsLzDOFehpFizUhdikHgT_iqp_i8y3WMr6wlzqV15qvOwFZAyFg5p7_SMFJU43vIpGZQ4AOHKEOD9Ip3__9cPZrkRgpTudfOkBCpdaOUAv7LqiuyI1FLyr6DUZnLRfip6KycIuuTKxFPZqclFNj2Qksj5uUqr1krAeZDELtenV_ES98DaZc3I-b7gMGmDTaTTDMgeC-fS3P6CxTmgBSqHF" />
          </div>
          <div class="bg-white dark:bg-background-dark rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h1 class="text-2xl font-bold text-center text-primary mb-6">Iniciar Sesión</h1>
            <form>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" for="email">Correo Electrónico / Usuario</label>
                <input class="w-full px-4 py-3 bg-background-light dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400" id="email" name="email" placeholder="Ingresa tu correo o usuario" type="email" />
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" for="password">Contraseña</label>
                <input class="w-full px-4 py-3 bg-background-light dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400" id="password" name="password" placeholder="Ingresa tu contraseña" type="password" />
              </div>
              <button class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300" type="submit">
                Iniciar Sesión
              </button>
              <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                ¿No tienes una cuenta? <a class="font-medium text-primary hover:underline" href="/register">Regístrate</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
});