import React from "react";
import { Menu, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

export default function NavBarLinks() {
   const navigate = useNavigate();


   const items = [
      {
         key: "profile",
         label: (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: '0.5rem 0' }}>
               <Avatar size={40} icon={<UserOutlined />} />
               <div style={{ display: "flex", flexDirection: "column"}}>
                  <span style={{ fontWeight: 600 }}>Nombre de usuario</span>
               </div>
            </div>
         ),

      },
      { key: "/crearEnvio", label: "Crear Envio", onClick: () => navigate("/crearEnvio") },
      { key: "/misEnvios", label: "Mis envios", onClick: () => navigate("/") },
      { key: "/configuracion", label: "Configuracion", onClick: () => navigate("/configuracion") },
   ];

   return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", paddingTop: 16 }}>
         <div style={{ flex: 1, overflow: "auto", padding: "0 0 1rem 0" }}>
            <Menu mode="inline" items={items} style={{ height: "100%", borderRight: 0 }} />
         </div>
      </div>
   );
}