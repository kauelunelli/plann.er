import axios from "axios";

const messagesByCode: Record<string, string> = {
  AUTH_TOKEN_MISSING: "Sua sessao expirou. Faca login novamente.",
  AUTH_TOKEN_INVALID: "Sua sessao expirou. Faca login novamente.",
  TRIP_UPDATE_WOULD_DELETE_ACTIVITIES: "Ao alterar o periodo, atividades fora do novo intervalo serao removidas.",
  VALIDATION_ERROR: "Confira os dados informados e tente novamente.",
  INTERNAL_SERVER_ERROR: "Ocorreu um erro inesperado. Tente novamente.",
};

const messagesByBackendMessage: Record<string, string> = {
  "Start date should be in the future": "A data de inicio precisa ser no futuro.",
  "Start date should be before end date": "A data de inicio deve ser anterior a data de fim.",
  "Activity should be within trip dates": "A atividade deve estar dentro das datas da viagem.",
  "Trip not found": "Viagem nao encontrada.",
  "Participant not found": "Participante nao encontrado.",
  "Activity not found": "Atividade nao encontrada.",
  "Link not found": "Link nao encontrado.",
  "You are not the owner of this trip": "Voce nao tem permissao para alterar esta viagem.",
  "User not logged in": "Faca login para continuar.",
  "User does not exist": "Usuario invalido. Faca login novamente.",
  "Email already in use": "Este e-mail ja esta em uso.",
  "User not found": "E-mail ou senha invalidos.",
  "Invalid password": "E-mail ou senha invalidos.",
  "Token não fornecido": "Sua sessao expirou. Faca login novamente.",
  "Token inválido ou expirado": "Sua sessao expirou. Faca login novamente.",
  "Token nao fornecido": "Sua sessao expirou. Faca login novamente.",
  "Token invalido ou expirado": "Sua sessao expirou. Faca login novamente.",
};

type ErrorBody = {
  code?: string;
  message?: string;
  errors?: string[];
};

export function getReadableErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Nao foi possivel concluir a operacao.";
  }

  const data = (error.response?.data ?? {}) as ErrorBody;

  if (data.code && messagesByCode[data.code]) {
    if (data.code === "VALIDATION_ERROR" && data.errors?.length) {
      return data.errors[0];
    }

    return messagesByCode[data.code];
  }

  if (data.message && messagesByBackendMessage[data.message]) {
    return messagesByBackendMessage[data.message];
  }

  if (data.errors?.length) {
    return data.errors[0];
  }

  if (data.message) {
    return data.message;
  }

  if (error.response?.status === 401 || error.response?.status === 403) {
    return "Sua sessao expirou. Faca login novamente.";
  }

  return "Nao foi possivel concluir a operacao.";
}
