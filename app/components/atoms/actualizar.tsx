import {
    Typography,
    Flex,
    Form,
    Input,
    Button,
    Card,
    Alert,
    Select,
    Divider,
    message,
} from "antd";
import { useState } from "react";
import { encomiendaService } from '~/services/encomiendaService';

const { Title } = Typography;
const { Option } = Select;

export default function Actualizar() {
    const [trackingFound, setTrackingFound] = useState(false);
    const [encomiendaData, setEncomiendaData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    // Función que se ejecuta al enviar el formulario de búsqueda
    const onSearchFinish = async (values: any) => {
        setSearchLoading(true);
        try {
            // Buscar la encomienda por código
            const encomienda = await encomiendaService.buscarPorCodigo(values.trackingCode);

            setEncomiendaData(encomienda);
            setTrackingFound(true);
            updateForm.resetFields();

            message.success(`Encomienda ${values.trackingCode} encontrada`);

        } catch (error: any) {
            setTrackingFound(false);
            setEncomiendaData(null);

            const errorMessage = error.response?.data?.message ||
                `Código ${values.trackingCode} no encontrado`;
            message.error(errorMessage);
        } finally {
            setSearchLoading(false);
        }
    };

    // Función que se ejecuta al enviar el formulario de actualización de estado
    const onUpdateFinish = async (values: any) => {
        setLoading(true);

        try {
            const codigoSeguimiento = searchForm.getFieldValue("trackingCode");

            // Mapear los valores del formulario al DTO del backend
            const payload = {
                nuevoEstado: values.newStatus,
                ubicacion: values.ubicacion || null,
                comentarios: values.updateDetails || null,
            };

            console.log('Actualizando encomienda:', codigoSeguimiento, payload);

            // Llamar al servicio para actualizar el estado
            const encomiendaActualizada = await encomiendaService.actualizarEstado(
                codigoSeguimiento,
                payload
            );

            // Mostrar mensaje de éxito
            message.success(
                `✅ El estado del paquete ${codigoSeguimiento} se editó correctamente a: ${values.newStatus}`
            );

            // Actualizar los datos mostrados
            setEncomiendaData(encomiendaActualizada);

            // Resetear el formulario de actualización
            updateForm.resetFields();

            // Opcional: Ocultar la sección de actualización
            // setTrackingFound(false);

        } catch (error: any) {
            console.error("Error al actualizar:", error);

            const errorMessage = error.response?.data?.message ||
                "Hubo un error al intentar actualizar el estado.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card bodyStyle={{ padding: "32px" }}>
            <Form
                form={searchForm}
                layout="vertical"
                onFinish={onSearchFinish}
            >
                <Flex vertical align="center" style={{ width: "100%" }}>
                    <Title level={2} style={{ marginBottom: "8px" }}>
                        Rastrea tu envío en tiempo real
                    </Title>
                    <p style={{ marginBottom: "32px", textAlign: "center" }}>
                        Ingresa el código de seguimiento que recibiste para ver el estado de
                        tu encomienda
                    </p>

                    <Flex gap={12} style={{ width: "100%", maxWidth: "450px" }}>
                        {/* Input y su Label */}
                        <Form.Item
                            name="trackingCode"
                            label="Código de seguimiento"
                            style={{ flex: 1, marginBottom: 0 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor, ingresa el código de seguimiento",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Ingresa tu código (Ej: ABC-123456789)"
                                size="large"
                            />
                        </Form.Item>

                        {/* Botón de Búsqueda */}
                        <Form.Item
                            style={{ marginBottom: 0, marginTop: "30px" }}
                        >
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={searchLoading}
                            >
                                Buscar
                            </Button>
                        </Form.Item>
                    </Flex>
                </Flex>
            </Form>

            {/* ----------------------------------------------------- */}
            {trackingFound && <Divider />}
            {/* ----------------------------------------------------- */}

            {/* 📦 INFORMACIÓN DE LA ENCOMIENDA ENCONTRADA */}
            {trackingFound && encomiendaData && (
                <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                    <Alert
                        message="Encomienda Encontrada"
                        description={
                            <div>
                                <p><strong>Código:</strong> {encomiendaData.codigoSeguimiento}</p>
                                <p><strong>Estado Actual:</strong> {encomiendaData.estado}</p>
                                <p><strong>Origen:</strong> {encomiendaData.origenCiudad}</p>
                                <p><strong>Destino:</strong> {encomiendaData.destinoCiudad}</p>
                                <p><strong>Ubicación Actual:</strong> {encomiendaData.ubicacionActual}</p>
                                <p><strong>Remitente:</strong> {encomiendaData.remitenteNombre}</p>
                                <p><strong>Destinatario:</strong> {encomiendaData.destinatarioNombre}</p>
                            </div>
                        }
                        type="success"
                        showIcon
                    />
                </div>
            )}

            {/* 🔍 APARTADO DE ACTUALIZACIÓN VISIBLE SÓLO SI SE ENCUENTRA EL CÓDIGO */}
            {trackingFound && (
                <div style={{ marginTop: "32px" }}>
                    <Title level={3} style={{ marginBottom: "24px", textAlign: "center" }}>
                        Actualizar Estado 📝
                    </Title>

                    {/* Formulario de Actualización de Estado */}
                    <Form
                        form={updateForm}
                        layout="vertical"
                        onFinish={onUpdateFinish}
                        style={{ maxWidth: "600px", margin: "0 auto" }}
                    >
                        <Form.Item
                            name="newStatus"
                            label="Nuevo Estado"
                            rules={[
                                {
                                    required: true,
                                    message: "Selecciona el nuevo estado del envío",
                                },
                            ]}
                        >
                            <Select placeholder="Selecciona el estado">
                                <Option value="EN_RECEPCION">En Recepción</Option>
                                <Option value="EN_DESPACHO">En Despacho</Option>
                                <Option value="EN_TRANSITO">En Tránsito</Option>
                                <Option value="ENTREGADO">Entregado</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="ubicacion"
                            label="Ubicación Actual (Opcional)"
                        >
                            <Input
                                placeholder="Ej: Centro de Distribución Santiago"
                            />
                        </Form.Item>

                        <Form.Item
                            name="updateDetails"
                            label="Comentarios"
                            rules={[
                                {
                                    required: true,
                                    message: "Ingresa comentarios sobre la actualización",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Ej: Paquete cargado en vehículo de reparto, Salió de la aduana, etc."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? "Actualizando..." : "Actualizar Estado"}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </Card>
    );
}