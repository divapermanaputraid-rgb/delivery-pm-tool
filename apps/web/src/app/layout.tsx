export const metadata = {
  title: "Delivery PM Tool",
  description: "Backend-first MVP for sofware delivery tracking",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
