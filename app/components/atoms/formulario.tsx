import { Card, Typography, Flex, Form, Input, Button, Result, message, Spin } from "antd";
import { useState } from "react";
import { encomiendaService } from '~/services/encomiendaService';

const { Title } = Typography;

const sectionStyle = {
    padding: '24px',
    backgroundColor: '#fafafa',
    borderRadius: '6px',
    border: '1px solid #f0f0f0',
};

export default function Formulario() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const columnGap = 48;

    const parseUbicacion = (ubicacion: string) => {
        const parts = ubicacion.trim().split(' ');
        const codigoPostal = parts[parts.length - 1];
        const ciudad = parts.slice(0, -1).join(' ');
        return { ciudad, codigoPostal };
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const origenParsed = parseUbicacion(values.origen);
            const destinoParsed = parseUbicacion(values.destino);

            const payload = {
                origenCiudad: origenParsed.ciudad,
                origenCodigoPostal: origenParsed.codigoPostal,
                remitenteNombre: values.remitenteNombre,
                remitenteDireccion: values.remitenteDireccion,
                destinoCiudad: destinoParsed.ciudad,
                destinoCodigoPostal: destinoParsed.codigoPostal,
                destinatarioNombre: values.destinatarioNombre,
                destinatarioDireccion: values.destinatarioDireccion,
                tipoPaquete: values.tipo,
                peso: parseFloat(values.peso),
                largo: parseFloat(values.largo),
                ancho: parseFloat(values.ancho),
                alto: parseFloat(values.alto),
            };

            // Usando axios a través del servicio
            const response = await encomiendaService.crearEncomienda(payload);

            setTrackingCode(response.codigoSeguimiento);
            setIsSubmitted(true);
            message.success('¡Encomienda registrada correctamente!');

        } catch (error: any) {
            console.error('Error al crear encomienda:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Error al registrar la encomienda. Intenta de nuevo.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = () => {
        if (trackingCode) {
            navigator.clipboard.writeText(trackingCode);
            message.success(`Código ${trackingCode} copiado al portapapeles.`);
        }
    };

    const handleNewShipment = () => {
        setIsSubmitted(false);
        setTrackingCode('');
        form.resetFields();
    };

    return (
        <Spin spinning={loading} tip="Registrando encomienda...">
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
                <Card bodyStyle={{ padding: '32px' }}>

                    <Title level={2}>
                        Registrar nueva encomienda
                    </Title>
                    <p style={{ marginBottom: '50px' }}>Completa los detalles a continuacion para generar tu envío</p>

                    <Flex gap={columnGap} align="flex-start">

                        {/* Columna izquierda (Campos de Formulario) */}
                        <Flex vertical style={{ flex: '3' }} gap={24}>

                            {/* APARTADO 1: Información de Origen y Destino */}
                            <div style={sectionStyle}>
                                <Title level={3} style={{ marginTop: 0, marginBottom: '16px' }}>
                                    Información de Origen y Destino
                                </Title>
                                <Flex gap={24}>
                                    <Form.Item
                                        label="Origen (Ciudad Código Postal)"
                                        name="origen"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: Santiago 8320000" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Destino (Ciudad Código Postal)"
                                        name="destino"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: Valparaíso 2340000" />
                                    </Form.Item>
                                </Flex>
                                <Flex gap={24}>
                                    <Form.Item
                                        label="Nombre Remitente"
                                        name="remitenteNombre"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: Juan Pérez" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Dirección Remitente"
                                        name="remitenteDireccion"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: Calle Principal 123" />
                                    </Form.Item>
                                </Flex>
                                <Flex gap={24}>
                                    <Form.Item
                                        label="Nombre Destinatario"
                                        name="destinatarioNombre"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: Carlos López" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Dirección Destinatario"
                                        name="destinatarioDireccion"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: Avenida Central 456" />
                                    </Form.Item>
                                </Flex>
                            </div>

                            {/* APARTADO 2: Detalles del Paquete */}
                            <div style={sectionStyle}>
                                <Title level={3} style={{ marginTop: 0, marginBottom: '16px' }}>
                                    Detalles del Paquete
                                </Title>
                                <Flex gap={24}>
                                    <Form.Item
                                        label="Peso (kg)"
                                        name="peso"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: 2.5" type="number" step="0.1" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Tipo de paquete"
                                        name="tipo"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ej: Caja" />
                                    </Form.Item>
                                    <Form.Item style={{ flex: 1 }}></Form.Item>
                                </Flex>
                                <Flex gap={24}>
                                    <Form.Item
                                        label="Largo (cm)"
                                        name="largo"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="30" type="number" step="0.1" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Ancho (cm)"
                                        name="ancho"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="20" type="number" step="0.1" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Alto (cm)"
                                        name="alto"
                                        rules={[{ required: true, message: '¡Campo requerido!' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="10" type="number" step="0.1" />
                                    </Form.Item>
                                </Flex>
                            </div>

                            {/* Botón de Envío */}
                            <Form.Item style={{ marginTop: '24px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{ width: '100%' }}
                                    disabled={isSubmitted || loading}
                                    loading={loading}
                                >
                                    Registrar Envío
                                </Button>
                            </Form.Item>

                        </Flex>

                        {/* Separador Vertical */}
                        <div style={{
                            width: '1px',
                            backgroundColor: '#e0e0e0',
                            alignSelf: 'stretch',
                            minHeight: '350px'
                        }} />

                        {/* Columna Derecha: Código / Confirmación */}
                        <Flex vertical style={{ flex: '1', minWidth: '250px' }}>

                            {/* APARTADO 3: Renderizado Condicional */}
                            <div style={sectionStyle}>
                                {isSubmitted ? (
                                    <Result
                                        status="success"
                                        title="¡Envío registrado con éxito!"
                                        subTitle={
                                            <div>
                                                Su código de seguimiento es:
                                                <Title level={4} style={{ margin: '8px 0', color: '#1890ff' }}>
                                                    {trackingCode}
                                                </Title>
                                            </div>
                                        }
                                        extra={
                                            <Flex vertical gap={10}>
                                                <Button
                                                    type="primary"
                                                    onClick={handleCopyCode}
                                                    block
                                                >
                                                    Copiar Código
                                                </Button>
                                                <Button
                                                    onClick={handleNewShipment}
                                                    block
                                                >
                                                    Registrar Nuevo Envío
                                                </Button>
                                            </Flex>
                                        }
                                    />
                                ) : (
                                    <>
                                        <Title level={3} style={{ marginTop: 0, marginBottom: '16px' }}>
                                            Código del Paquete
                                        </Title>
                                        <p>Una vez hayas completado y enviado el formulario correctamente el codigo de seguimiento aparecera aquí</p>
                                    </>
                                )}
                            </div>
                        </Flex>
                    </Flex>
                </Card>
            </Form>
        </Spin>
    );
}