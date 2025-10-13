# ShadCN Dialog Manager Registry

A custom shadcn/ui registry providing a unified dialog management system for React applications. This registry allows you to easily add a type-safe, promise-based dialog management solution to your shadcn projects.

## 🚀 Quick Start

Add the dialog manager to your shadcn project:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/vastamaki/shadcn-dialog-manager/master/public/r/dialog-manager.json
```

## 📖 Usage

After installation, you can use the dialog manager in your React application:

```tsx
import { DialogProvider } from "@/components/dialog-provider";
import { useDialog } from "@/hooks/use-dialog";

// 1. Wrap your app with the provider
function App() {
  return (
    <DialogProvider>
      <YourAppContent />
    </DialogProvider>
  );
}

// 2. Use dialogs in your components
function MyComponent() {
  const { openDialog } = useDialog();

  const handleAction = async () => {
    const result = await openDialog("example", {
      title: "Confirm Action",
      message: "Are you sure?",
    });

    if (result) {
      // User confirmed
    }
  };

  return <button onClick={handleAction}>Open Dialog</button>;
}
```
