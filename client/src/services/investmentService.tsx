import api from './api';
import { Investment, Portfolio, InvestmentData } from '../types';

interface InvestmentResponse {
  investment: Investment;
  transaction: IDBTransaction;
}

// Get investments
const getInvestments = async (): Promise<Investment[]> => {
  const response = await api.get<Investment[]>('/api/investments');
  return response.data;
};

// Get portfolio
const getPortfolio = async (): Promise<Portfolio> => {
  const response = await api.get<Portfolio>('/api/investments/portfolio');
  return response.data;
};

// Create investment
const createInvestment = async (investmentData: InvestmentData): Promise<InvestmentResponse> => {
  const response = await api.post<InvestmentResponse>('/api/investments', investmentData);
  return response.data;
};

// Sell investment
const sellInvestment = async (id: string): Promise<InvestmentResponse> => {
  const response = await api.put<InvestmentResponse>(`/api/investments/${id}/sell`);
  return response.data;
};

const investmentService = {
  getInvestments,
  getPortfolio,
  createInvestment,
  sellInvestment
};

export default investmentService;