import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageContainer({ children, title, description, action }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-secondary/20">
      <Sidebar />
      <div className="lg:ml-72 flex flex-col min-h-screen">
        <MobileHeader />
        
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {(title || action) && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                {title && (
                  <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-display font-bold tracking-tight text-foreground"
                  >
                    {title}
                  </motion.h1>
                )}
                {description && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground mt-1 text-lg"
                  >
                    {description}
                  </motion.p>
                )}
              </div>
              {action && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {action}
                </motion.div>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
