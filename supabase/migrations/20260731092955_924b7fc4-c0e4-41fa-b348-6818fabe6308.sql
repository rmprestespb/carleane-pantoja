DELETE FROM public.services;
INSERT INTO public.services (name, detail, price, sort_order) VALUES
('Massagem Relaxante', 'Toque suave e ritmado para aliviar o estresse do dia a dia.', 120.00, 1),
('Massagem Terapêutica', 'Pressão ajustada para tratar dores e tensões musculares.', 140.00, 2),
('Massagem com Pedras Quentes', 'Pedras vulcânicas aquecidas e óleos aromáticos para relaxamento profundo.', 150.00, 3),
('Drenagem Linfática', 'Movimentos leves que reduzem inchaço e ativam a circulação.', 130.00, 4),
('Ventosaterapia', 'Ventosas que liberam a fáscia e melhoram a circulação local.', 80.00, 5),
('Aplicação de Kinésio', 'Bandagem elástica (aplicação simples) para suporte muscular.', 40.00, 6),
('Sessão de Dry Needling', 'Agulhamento seco para desativar pontos-gatilho.', 150.00, 7),
('Combo Queridinho', 'Massagem + ventosa + kinésio em uma única sessão.', 150.00, 8),
('Pacote de Massagens', '5 sessões de massagem com valor especial.', 400.00, 9);