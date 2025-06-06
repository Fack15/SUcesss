
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, Redirect, useLocation } from "wouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AuthForm from "./pages/AuthForm";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import ProductDetails from "./pages/ProductDetails";
import IngredientList from "./pages/IngredientList";
import IngredientForm from "./pages/IngredientForm";
import IngredientDetails from "./pages/IngredientDetails";
import ProductImport from "./pages/ProductImport";
import IngredientImport from "./pages/IngredientImport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }
  
  return <>{children}</>;
};

// Public Route wrapper (redirect to products if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  if (isAuthenticated) {
    setLocation("/products");
    return null;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" component={AdminDashboard} />
      <Route path="/login">
        <PublicRoute>
          <AuthForm />
        </PublicRoute>
      </Route>
      <Route path="/products">
        <ProtectedRoute>
          <ProductList />
        </ProtectedRoute>
      </Route>
      <Route path="/products/create">
        <ProtectedRoute>
          <ProductForm />
        </ProtectedRoute>
      </Route>
      <Route path="/products/edit/:id">
        {params => (
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/products/details/:id">
        {params => (
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/products/import">
        <ProtectedRoute>
          <ProductImport />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients">
        <ProtectedRoute>
          <IngredientList />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients/create">
        <ProtectedRoute>
          <IngredientForm />
        </ProtectedRoute>
      </Route>
      <Route path="/ingredients/edit/:id">
        {params => (
          <ProtectedRoute>
            <IngredientForm />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/ingredients/details/:id">
        {params => (
          <ProtectedRoute>
            <IngredientDetails />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/ingredients/import">
        <ProtectedRoute>
          <IngredientImport />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
