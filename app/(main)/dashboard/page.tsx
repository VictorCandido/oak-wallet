"use client"

import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, CalendarIcon, SearchIcon } from "lucide-react"

// Tipo atualizado para nossas transações
type Categoria = "Moradia" | "Alimentação" | "Transporte" | "Lazer" | "Saúde" | "Outros"

type Transacao = {
  id: number
  descricao: string
  tipo: "receita" | "despesa"
  categoria: Categoria
  valor: number
  data: Date
}

// Componente Modal atualizado
const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  tipo,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (descricao: string, valor: number, data: Date, categoria: Categoria) => void
  tipo: "receita" | "despesa"
}) => {
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [data, setData] = useState("")
  const [categoria, setCategoria] = useState<Categoria>("Outros")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(descricao, Number.parseFloat(valor), new Date(data), categoria)
    setDescricao("")
    setValor("")
    setData("")
    setCategoria("Outros")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Adicionar {tipo}</h3>
          <form className="mt-2 px-7 py-3" onSubmit={handleSubmit}>
            <input
              type="text"
              className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
            <input
              type="number"
              className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
            <input
              type="date"
              className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
            <select
              className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              required
            >
              <option value="Moradia">Moradia</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Lazer">Lazer</option>
              <option value="Saúde">Saúde</option>
              <option value="Outros">Outros</option>
            </select>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                type="submit"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ControleFinanceiro() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: 1, descricao: "Salário", tipo: "receita", categoria: "Outros", valor: 5000, data: new Date(2023, 5, 5) },
    { id: 2, descricao: "Aluguel", tipo: "despesa", categoria: "Moradia", valor: 1200, data: new Date(2023, 5, 10) },
    {
      id: 3,
      descricao: "Supermercado",
      tipo: "despesa",
      categoria: "Alimentação",
      valor: 500,
      data: new Date(2023, 5, 15),
    },
    { id: 4, descricao: "Freelance", tipo: "receita", categoria: "Outros", valor: 1000, data: new Date(2023, 5, 20) },
    {
      id: 5,
      descricao: "Conta de luz",
      tipo: "despesa",
      categoria: "Moradia",
      valor: 150,
      data: new Date(2023, 5, 25),
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tipoLancamento, setTipoLancamento] = useState<"receita" | "despesa">("receita")
  const [searchTerm, setSearchTerm] = useState("")

  const saldoTotal = transacoes.reduce(
    (acc, transacao) => (transacao.tipo === "receita" ? acc + transacao.valor : acc - transacao.valor),
    0,
  )

  const saldoMes = transacoes
    .filter((t) => t.data.getMonth() === new Date().getMonth() && t.data.getFullYear() === new Date().getFullYear())
    .reduce((acc, transacao) => (transacao.tipo === "receita" ? acc + transacao.valor : acc - transacao.valor), 0)

  const handleNovoLancamento = (tipo: "receita" | "despesa") => {
    setTipoLancamento(tipo)
    setIsModalOpen(true)
  }

  const adicionarLancamento = (descricao: string, valor: number, data: Date, categoria: Categoria) => {
    const novaTransacao: Transacao = {
      id: transacoes.length + 1,
      descricao,
      tipo: tipoLancamento,
      categoria,
      valor,
      data,
    }
    setTransacoes([novaTransacao, ...transacoes].sort((a, b) => b.data.getTime() - a.data.getTime()))
  }

  // Função para formatar a data
  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  // Filtra as transações com base no termo de pesquisa
  const transacoesFiltradas = transacoes.filter(
    (transacao) =>
      transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Controle Financeiro</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-2">Saldo Total</h2>
              <p className={`text-3xl font-bold ${saldoTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {saldoTotal.toFixed(2)}
              </p>
            </div>
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-2">Balanço do Mês</h2>
              <p className={`text-3xl font-bold ${saldoMes >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {saldoMes.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => handleNovoLancamento("receita")}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <PlusIcon className="inline-block mr-2 h-5 w-5" />
                Receita
              </button>
              <button
                onClick={() => handleNovoLancamento("despesa")}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <PlusIcon className="inline-block mr-2 h-5 w-5" />
                Despesa
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar lançamentos..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Últimos Lançamentos</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {transacoesFiltradas.map((transacao) => (
                  <li key={transacao.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">{transacao.descricao}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transacao.tipo === "receita" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                          >
                            {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {transacao.tipo === "receita" ? (
                              <ArrowUpIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                            ) : (
                              <ArrowDownIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-500" />
                            )}
                            R$ {transacao.valor.toFixed(2)}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {formatarData(transacao.data)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p className="bg-gray-100 px-2 py-1 rounded-full">{transacao.categoria}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={adicionarLancamento}
        tipo={tipoLancamento}
      />
    </div>
  )
}

