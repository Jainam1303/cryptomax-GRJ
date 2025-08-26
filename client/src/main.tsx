import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { AuthProvider } from './context/AuthContext'
import { CryptoProvider } from './context/CryptoContext'
import { WalletProvider } from './context/WalletContext'
import { InvestmentProvider } from './context/InvestmentContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <AuthProvider>
        <CryptoProvider>
          <WalletProvider>
            <InvestmentProvider>
              <App />
            </InvestmentProvider>
          </WalletProvider>
        </CryptoProvider>
      </AuthProvider>
    </ThemeProvider>
  </Provider>
);
