from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.models import FormaPagamentoEnum, TamanhoEnum


# --- USUÁRIO ---
class UserSchema(BaseModel):
    nome: str = Field(min_length=3, max_length=120, strip_whitespace=True)
    email: EmailStr
    senha: str = Field(min_length=8, max_length=72)
    ativo: bool | None = True
    admin: bool | None = False


# --- USUÁRIO SIGNUP ---
class UserSignUpSchema(BaseModel):
    nome: str = Field(min_length=3, max_length=120, strip_whitespace=True)
    email: EmailStr
    senha: str = Field(min_length=8, max_length=72)


# --- ATUALIZAÇÃO DE USUÁRIO ---
class UserUpdateSchema(BaseModel):
    nome: str | None = None
    email: str | None = None


# --- LOGIN ---
class LoginSchema(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=1, max_length=72)


class ForgetPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    email: EmailStr
    code: str = Field(pattern=r"^[0-9]{6}$")
    reset_token: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=72)


class VerifyResetCodeSchema(BaseModel):
    email: EmailStr
    code: str = Field(pattern=r"^[0-9]{6}$")
    reset_token: str = Field(min_length=1)


# --- ITENS DE PEDIDO ---
class ItemPedidoSchema(BaseModel):
    item_cardapio_id: int
    quantidade: int = Field(gt=0)
    tamanho: TamanhoEnum | None = None


# --- CHECKOUT (CARRINHO INTEIRO EM UMA UNICA OPERACAO) ---
class FormaPagamentoSchema(str, Enum):
    """Valores aceitos no JSON: nomes do enum persistido no banco."""

    DINHEIRO = "DINHEIRO"
    CARTAO_CREDITO = "CARTAO_CREDITO"
    CARTAO_DEBITO = "CARTAO_DEBITO"
    PIX = "PIX"
    VALE_ALIMENTACAO = "VALE_ALIMENTACAO"


class CheckoutSchema(BaseModel):
    itens: list[ItemPedidoSchema] = Field(min_length=1)
    endereco_entrega: str = Field(min_length=1, max_length=500)
    forma_pagamento: FormaPagamentoSchema
    telefone_contato: str = Field(min_length=1, max_length=20)
    troco_para: float | None = Field(default=None, ge=0)
    observacao: str | None = None


class ItemPedidoSchemaResponse(BaseModel):
    id: int
    item_id: int
    quantidade: int
    sabor: str
    tamanho: str
    preco_unitario: float

    model_config = ConfigDict(from_attributes=True)


# --- PEDIDO ---
class StatusSchema(str, Enum):
    FINALIZADO = "FINALIZADO"
    PENDENTE = "PENDENTE"
    CANCELADO = "CANCELADO"


# --- RESPOSTA DO CHECKOUT ---
class ItemCheckoutResponse(BaseModel):
    item_cardapio_id: int
    nome_snapshot: str
    tamanho: str | None = None
    quantidade: int
    preco_unitario: float


class PedidoCheckoutResponse(BaseModel):
    id: int
    status: StatusSchema
    itens: list[ItemCheckoutResponse]
    total: float


class CheckoutResponse(BaseModel):
    pedido: PedidoCheckoutResponse


class PedidoSchemaResponse(BaseModel):
    id: int
    usuario_id: int
    status: StatusSchema
    preco: float
    endereco_entrega: str | None = None
    forma_pagamento: FormaPagamentoEnum | None = None
    troco_para: float | None = None
    observacao: str | None = None
    telefone_contato: str | None = None
    created_at: str | None = None
    itens: list[ItemPedidoSchemaResponse] = []

    model_config = ConfigDict(from_attributes=True)


class FinalizarPedidoSchema(BaseModel):
    endereco_entrega: str
    forma_pagamento: FormaPagamentoEnum
    troco_para: float | None = None
    observacao: str | None = None
    telefone_contato: str | None = None


# --- CARDÁPIO --
class ItemCardapioCreate(BaseModel):
    nome: str
    descricao: str | None = None
    preco: float
    categoria: str
