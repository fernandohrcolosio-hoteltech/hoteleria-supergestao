import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOnboardingEmail(email: string, token: string, planName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const cadastroLink = `${appUrl}/cadastro/${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@hoteleria-supergestao.com",
      to: email,
      subject: "Parabéns! Seu pagamento foi confirmado 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #001f3f; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Bem-vindo! 🎉</h1>
            <p style="font-size: 18px; margin: 10px 0;">Seu pagamento foi confirmado com sucesso</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Olá,</p>

            <p style="color: #666; line-height: 1.6;">
              Seu acesso ao plano <strong>${planName}</strong> está pronto!
            </p>

            <p style="color: #666; line-height: 1.6;">
              Para começar a usar as ferramentas de melhoria contínua, clique no botão abaixo para criar sua conta:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${cadastroLink}" style="background-color: #c9a84c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                Criar Conta e Acessar
              </a>
            </div>

            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Ou copie este link em seu navegador:<br/>
              <code style="background-color: #f0f0f0; padding: 10px; display: block; margin-top: 10px; word-break: break-all;">
                ${cadastroLink}
              </code>
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <p style="color: #999; font-size: 12px; text-align: center;">
              Este link expira em 7 dias. Se tiver dúvidas, responda este email.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Email de onboarding enviado para ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    return false;
  }
}
