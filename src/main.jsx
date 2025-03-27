import React, { useCallback, useEffect, useState, createContext } from "react";
import ReactDOM from "react-dom/client"
import Header from "./Component/Header";
import Body from "./Component/Body";

export const ThemeContext = createContext(null);

function GithubProfile(){
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(curr => curr === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <Header />
        <Body />
      </div>
    </ThemeContext.Provider>
  )
}

// Error boundary wrapper
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <GithubProfile/>
  </ErrorBoundary>
);