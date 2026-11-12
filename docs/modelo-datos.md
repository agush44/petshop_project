# Modelo de datos y permisos

La aplicación sí utiliza MongoDB Atlas. Express accede a la base mediante Mongoose; cada modelo define una colección. El frontend consume la API REST del backend, no se conecta directamente a Atlas.

```mermaid
erDiagram
    USER ||--o{ ORDER : realiza
    PRODUCT ||--o{ ORDER_ITEM : aparece_en
    ORDER ||--|{ ORDER_ITEM : contiene
    USER {
        ObjectId _id
        string email UK
        string password "hash bcrypt"
        string role "user | admin"
        datetime createdAt
    }
    PRODUCT {
        ObjectId _id
        string name
        string category
        string animalType
        number price
        number stock
        number discount
        string image
    }
    ORDER {
        ObjectId _id
        ObjectId user "opcional para invitado"
        number total
        string status
        string payment.method
        string payment.status
        string payment.paymentId
        object shipping
        datetime createdAt
    }
    ORDER_ITEM {
        ObjectId product
        string name "snapshot"
        number price "snapshot"
        number quantity
    }
    POST {
        ObjectId _id
        string title
        string slug UK
        boolean published
        array sections
    }
    SERVICE {
        ObjectId _id
        string name
        number price
        boolean active
    }
    CONTACT_MESSAGE {
        ObjectId _id
        string name
        string email
        string message
    }
    NEWSLETTER_SUBSCRIBER {
        ObjectId _id
        string email UK
    }
```

`Order.user` es opcional porque el checkout permite compras de invitados. Los artículos del pedido guardan una referencia al producto y una copia del nombre y precio de la compra, para conservar el detalle aunque el catálogo cambie después.

## Roles y autorización

- El modelo `User` guarda `role` con los valores `user` o `admin`; el registro público asigna `user` por defecto. La contraseña se persiste como hash bcrypt.
- Al iniciar sesión, el backend firma un JWT con el identificador, email y rol, con una hora de expiración. El frontend guarda el token y usa el rol para mostrar u ocultar pantallas.
- `AdminRoute` protege la navegación en React para mejorar la experiencia. La autorización real está en Express: `authToken` valida el JWT y `requireAdmin` verifica `req.user.role` antes de permitir operaciones administrativas.
- El script `backend/src/scripts/makeAdmin.js` permite promover una cuenta de forma explícita; no existe una opción pública de autoasignarse `admin`.

## Pagos

El checkout ofrece tres vías: Mercado Pago Checkout Pro, transferencia bancaria y coordinación por WhatsApp. Para Mercado Pago, el backend calcula los precios desde MongoDB, crea la preferencia de pago y redirige al checkout alojado. El regreso del navegador no acredita el pago: el backend valida la firma del webhook, consulta el pago a Mercado Pago y verifica importe, moneda y referencia del pedido antes de actualizar `payment.status`.

La transferencia queda como `pending` hasta que administración acredita manualmente el ingreso desde el panel de pedidos. Los datos bancarios visibles se configuran mediante variables `TRANSFER_*` en Render. El token del proveedor y el secreto de webhook permanecen en el backend (`MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`). Si esas credenciales todavía no están configuradas, Mercado Pago aparece deshabilitado y WhatsApp/transferencia siguen disponibles.
