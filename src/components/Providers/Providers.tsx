"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

import { ProductsProvider } from "@/components/products/ProductsContext";

const queryClient = new QueryClient();

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session;
}) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ProductsProvider>
            {children}
          </ProductsProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
