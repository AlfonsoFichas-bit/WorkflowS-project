import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import RegisterIsland from "../islands/RegisterIsland.tsx";

export default define.page(function Register() {
  return (
    <>
      <Head>
        <title>Registro - WorkflowS</title>
      </Head>
      <div class="fresh-gradient flex flex-col items-center justify-center min-h-screen p-6">
        <div class="w-full max-w-md">
          <div class="flex justify-center items-center gap-4 mb-8">
            <img alt="WorkflowS Logo" class="h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjsqfqwDZ252tpcQ5BaU7PoA3YNSW6ky0z9hQey_mDIREv-cdkjrt-RKJsXT3msMrjIxzmq49R6PgXuzPpYGsq3FFUuArKGHSOCLPyM_RI3VlEMFLD3fc_2zbcGDx9N05n6YMBBmGChTcJZXS0ROhEsDxBj-fTKr9vbW2FbwTD1aRgRxakJhWriv8bwxb3-3gHgTsNwhm8cMhe60YRkZU6LxxAtO7Zql3fCxWIjz6IJWtAisJwO-9W0abgpFlb6UtUf7jOZhxPRCLC" />
            <img alt="Universidad La Salle Logo" class="h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6fMylsoLD5bqSYyw5Y0aNKl-DmuxKV5xWM_QBTfrra-gca_ujHkAFTZvsLzDOFehpFizUhdikHgT_iqp_i8y3WMr6wlzqV15qvOwFZAyFg5p7_SMFJU43vIpGZQ4AOHKEOD9Ip3__9cPZrkRgpTudfOkBCpdaOUAv7LqiuyI1FLyr6DUZnLRfip6KycIuuTKxFPZqclFNj2Qksj5uUqr1krAeZDELtenV_ES98DaZc3I-b7gMGmDTaTTDMgeC-fS3P6CxTmgBSqHF" />
          </div>
          <RegisterIsland />
        </div>
      </div>
    </>
  );
});