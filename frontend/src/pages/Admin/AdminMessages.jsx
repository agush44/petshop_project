import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchContactMessages } from "@/lib/contactApi";
import { fetchNewsletterSubscribers } from "@/lib/newsletterApi";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchContactMessages().catch(() => {
        toast.error("No se pudieron cargar los mensajes de contacto");
        return [];
      }),
      fetchNewsletterSubscribers().catch(() => {
        toast.error("No se pudieron cargar los suscriptores");
        return [];
      }),
    ]).then(([messagesData, subscribersData]) => {
      setMessages(messagesData);
      setSubscribers(subscribersData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-heading text-2xl font-bold mb-6">Mensajes de contacto</h1>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no llegó ningún mensaje.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg._id}>
                  <TableCell className="font-medium align-top">
                    {msg.name}
                    <p className="text-xs text-muted-foreground sm:hidden">{msg.email}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell align-top">{msg.email}</TableCell>
                  <TableCell className="max-w-xs align-top whitespace-pre-line">
                    {msg.message}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell align-top whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString("es-AR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold mb-6">Suscriptores del newsletter</h2>
        {subscribers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay suscriptores.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Fecha de alta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell>{new Date(sub.createdAt).toLocaleDateString("es-AR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
