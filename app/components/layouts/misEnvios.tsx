import { Typography, Flex, Form, Input, Button, Card, Divider, Tag, message } from "antd";
import { useState } from "react";
import { encomiendaService } from '~/services/encomiendaService';

const { Title } = Typography;

export default function MisEnvios() {
    const [form] = Form.useForm();
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchedCode, setSearchedCode] = useState('');

    const onFinish = async (values: any) => {
        setIsSearching(true);
        setTrackingResult(null);
        setSearchedCode(values.trackingCode);

        try {
            // Llamar a la API real para buscar por código
            const encomienda = await encomiendaService.buscarPorCodigo(values.trackingCode);

            setTrackingResult(encomienda);
            message.success(`Encomienda ${values.trackingCode} encontrada`);

        } catch (error: any) {
            console.error('Error al buscar encomienda:', error);
            setTrackingResult(null);

            const errorMessage = error.response?.data?.message ||
                `No se encontró ningún envío con el código: ${values.trackingCode}`;
            message.error(errorMessage);
        } finally {
            setIsSearching(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'EN_RECEPCION': return 'default';
            case 'EN_DESPACHO': return 'processing';
            case 'EN_TRANSITO': return 'warning';
            case 'ENTREGADO': return 'success';
            default: return 'error';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'EN_RECEPCION': return 'En Recepción';
            case 'EN_DESPACHO': return 'En Despacho';
            case 'EN_TRANSITO': return 'En Tránsito';
            case 'ENTREGADO': return 'Entregado';
            default: return status;
        }
    };

    const DetailRow = ({ label, value }: { label: string; value: string }) => (
        <Flex justify="space-between" style={{ padding: '8px 0' }}>
            <Typography.Text strong>{label}:</Typography.Text>
            <Typography.Text>{value}</Typography.Text>
        </Flex>
    );

    const formatDate = (date: string) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Flex vertical align="center" style={{ width: '100%', padding: '40px 0' }}>

            <Title level={2} style={{ marginBottom: '8px', textAlign: 'center' }}>
                Rastrea tu envío en tiempo real
            </Title>
            <p style={{ marginBottom: '32px', textAlign: 'center', maxWidth: '600px' }}>
                Ingresa el código de seguimiento que recibiste para ver el estado de tu encomienda
            </p>

            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                style={{ width: '100%', maxWidth: '450px' }}
            >
                <Flex gap={12} style={{ width: '100%' }}>
                    <Form.Item
                        name="trackingCode"
                        label="Código de seguimiento"
                        style={{ flex: 1, marginBottom: 0 }}
                        rules={[{ required: true, message: 'Por favor, ingresa el código de seguimiento' }]}
                    >
                        <Input
                            placeholder="Ingresa tu código (Ej: ABC-123456789)"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: '30px' }}>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={isSearching}
                        >
                            {isSearching ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </Form.Item>
                </Flex>
            </Form>

            {/* Muestra el estado del envío si se encontró */}
            {trackingResult && (
                <Card
                    title="Estado de la encomienda"
                    style={{ width: '100%', maxWidth: '600px', marginTop: '40px' }}
                    headStyle={{ borderBottom: 'none' }}
                >
                    <Flex vertical gap={8}>
                        <DetailRow
                            label="Código de Seguimiento"
                            value={trackingResult.codigoSeguimiento}
                        />

                        <Flex justify="space-between" align="center" style={{ padding: '8px 0' }}>
                            <Typography.Text strong>Estado Actual:</Typography.Text>
                            <Tag
                                color={getStatusColor(trackingResult.estado)}
                                style={{ padding: '4px 12px', fontSize: '14px' }}
                            >
                                {getStatusLabel(trackingResult.estado)}
                            </Tag>
                        </Flex>

                        <Divider style={{ margin: '16px 0' }} />

                        <DetailRow
                            label="Origen"
                            value={`${trackingResult.origenCiudad} ${trackingResult.origenCodigoPostal || ''}`}
                        />
                        <DetailRow
                            label="Destino"
                            value={`${trackingResult.destinoCiudad} ${trackingResult.destinoCodigoPostal || ''}`}
                        />
                        <DetailRow
                            label="Remitente"
                            value={trackingResult.remitenteNombre}
                        />
                        <DetailRow
                            label="Destinatario"
                            value={trackingResult.destinatarioNombre}
                        />
                        <DetailRow
                            label="Ubicación Actual"
                            value={trackingResult.ubicacionActual}
                        />
                        <DetailRow
                            label="Fecha de Solicitud"
                            value={formatDate(trackingResult.fechaSolicitud)}
                        />
                        <DetailRow
                            label="Entrega Estimada"
                            value={trackingResult.fechaEntregaEstimada || 'Por confirmar'}
                        />

                        <Divider style={{ margin: '16px 0' }} />

                        <Typography.Text strong>Detalles del Paquete:</Typography.Text>
                        <DetailRow
                            label="Tipo"
                            value={trackingResult.tipoPaquete}
                        />
                        <DetailRow
                            label="Peso"
                            value={`${trackingResult.peso} kg`}
                        />
                        <DetailRow
                            label="Dimensiones"
                            value={`${trackingResult.largo} x ${trackingResult.ancho} x ${trackingResult.alto} cm`}
                        />
                    </Flex>
                </Card>
            )}

            {/* Muestra el mensaje de no encontrado */}
            {!trackingResult && !isSearching && searchedCode && (
                <Card
                    style={{ width: '100%', maxWidth: '600px', marginTop: '40px' }}
                    type="inner"
                >
                    <p style={{ textAlign: 'center', color: '#f5222d', fontWeight: 'bold' }}>
                        ❌ No se encontró ningún envío con el código: {searchedCode}
                    </p>
                    <p style={{ textAlign: 'center' }}>
                        Por favor, verifica el código e intenta de nuevo.
                    </p>
                </Card>
            )}
        </Flex>
    );
}