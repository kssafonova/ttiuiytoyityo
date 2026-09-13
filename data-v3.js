(function(root,factory){
  const data=factory();
  if(typeof module==='object'&&module.exports) module.exports=data;
  root.LUMI_DATA=data;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const types=[
    {id:'ct_window',name:'Обычное окно',short:'Окно',desc:'Классическое окно: 1, 2 или 3 секции, штульп или фрамуга.',priceLabel:'от 18 900 ₽',asset:'type__ct_double'},
    {id:'ct_panoramic',name:'Панорамное окно',short:'Панорамное',desc:'Большая площадь остекления, фиксированные, открывающиеся и портальные решения.',priceLabel:'по расчёту',asset:'type__ct_panoramic'},
    {id:'ct_balcony_block',name:'Балконный блок',short:'Балконный блок',desc:'Окно и балконная дверь в одной конструкции.',priceLabel:'по расчёту',asset:'type__ct_balcony_block'},
    {id:'ct_panoramic_door',name:'Панорамная дверь',short:'Панорамная дверь',desc:'Распашной, PSK или подъёмно-сдвижной выход на террасу.',priceLabel:'по расчёту',asset:'type__ct_entrance'}
  ];

  const schemes={
    ct_window:[
      {id:'sc_win_1',name:'1 секция',desc:'Одностворчатое окно.',sectionCount:1,uxGroup:'1',mechanism:'standard',sections:[{label:'Створка',role:'window',defaultOpening:'op_tilt_turn',ratio:1}]},
      {id:'sc_win_2_mullion',name:'2 секции · с импостом',desc:'Постоянная вертикальная стойка между секциями.',sectionCount:2,uxGroup:'2',uxMode:'mullion',mechanism:'standard',sections:[{label:'Левая секция',role:'window',defaultOpening:'op_fixed',ratio:.5},{label:'Правая секция',role:'window',defaultOpening:'op_tilt_turn',ratio:.5}],presets:[
        {id:'p_fix_tt',name:'Глухая + поворотно-откидная',values:['op_fixed','op_tilt_turn']},
        {id:'p_tt_fix',name:'Поворотно-откидная + глухая',values:['op_tilt_turn','op_fixed']},
        {id:'p_turn_tt',name:'Поворотная + поворотно-откидная',values:['op_turn','op_tilt_turn']}
      ]},
      {id:'sc_win_2_shtulp_right',name:'2 секции · штульп',desc:'Без стойки по центру, основная створка справа.',sectionCount:2,uxGroup:'2',uxMode:'shtulp',primarySide:'right',mechanism:'standard',sections:[{label:'Левая створка',role:'shtulp_passive',defaultOpening:'op_turn',ratio:.5},{label:'Правая створка',role:'shtulp_active',defaultOpening:'op_tilt_turn',ratio:.5}]},
      {id:'sc_win_2_shtulp_left',name:'2 секции · штульп',desc:'Без стойки по центру, основная створка слева.',sectionCount:2,uxGroup:'2',uxMode:'shtulp',primarySide:'left',mechanism:'standard',sections:[{label:'Левая створка',role:'shtulp_active',defaultOpening:'op_tilt_turn',ratio:.5},{label:'Правая створка',role:'shtulp_passive',defaultOpening:'op_turn',ratio:.5}]},
      {id:'sc_win_2_slide',name:'2 секции · раздвижное',desc:'Обычное раздвижное окно.',sectionCount:2,uxGroup:'2',uxMode:'slide',mechanism:'slide_window',disabled:true,disabledReason:'В текущем ассортименте нет подтверждённой обычной раздвижной оконной системы. Не подменяем её PSK.'},
      {id:'sc_win_3',name:'3 секции',desc:'Трёхсекционное окно.',sectionCount:3,uxGroup:'3',mechanism:'standard',sections:[{label:'Левая секция',role:'window',defaultOpening:'op_fixed',ratio:.33},{label:'Центральная секция',role:'window',defaultOpening:'op_tilt_turn',ratio:.34},{label:'Правая секция',role:'window',defaultOpening:'op_fixed',ratio:.33}],presets:[
        {id:'p_fix_tt_fix',name:'Популярная · FIX + TT + FIX',values:['op_fixed','op_tilt_turn','op_fixed']},
        {id:'p_tt_fix_tt',name:'Две открывающиеся · TT + FIX + TT',values:['op_tilt_turn','op_fixed','op_tilt_turn']},
        {id:'p_turn_tt_turn',name:'Все открываются · TURN + TT + TURN',values:['op_turn','op_tilt_turn','op_turn']}
      ]},
      {id:'sc_win_transom',name:'С верхней фрамугой',desc:'Фрамуга добавляется над основной створкой.',sectionCount:1,uxGroup:'other',uxMode:'transom',mechanism:'standard',layout:'transom',sections:[{label:'Основная створка',role:'window',defaultOpening:'op_tilt_turn',ratio:.78},{label:'Фрамуга',role:'transom',defaultOpening:'op_tilt',ratio:.22}]}
    ],
    ct_panoramic:[
      {id:'sc_pan_fixed',name:'Глухая панорама',desc:'Максимум стекла без открывания.',mechanism:'standard',sections:[{label:'Панорама',role:'window',defaultOpening:'op_fixed',ratio:1}]},
      {id:'sc_pan_2',name:'2 секции',desc:'Глухая + открывающаяся секция.',mechanism:'standard',sections:[{label:'Левая секция',role:'window',defaultOpening:'op_fixed',ratio:.58},{label:'Правая секция',role:'window',defaultOpening:'op_tilt_turn',ratio:.42}]},
      {id:'sc_pan_3',name:'3 секции',desc:'Три секции для широкого проёма.',mechanism:'standard',sections:[{label:'Левая',role:'window',defaultOpening:'op_fixed',ratio:.33},{label:'Центр',role:'window',defaultOpening:'op_tilt_turn',ratio:.34},{label:'Правая',role:'window',defaultOpening:'op_fixed',ratio:.33}]},
      {id:'sc_pan_psk',name:'PSK-портал',desc:'Параллельно-сдвижной ПВХ-портал.',mechanism:'psk',sections:[{label:'Активная створка',role:'portal',defaultOpening:'op_psk',ratio:.5},{label:'Глухая часть',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]},
      {id:'sc_pan_lift_slide',name:'Подъёмно-сдвижной портал',desc:'Большой алюминиевый портал.',mechanism:'lift_slide',sections:[{label:'Активная створка',role:'portal',defaultOpening:'op_lift_slide',ratio:.5},{label:'Глухая часть',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]}
    ],
    ct_balcony_block:[
      {id:'sc_bb_window_left',name:'Окно слева + дверь справа',desc:'Классическая компоновка.',mechanism:'standard',sections:[{label:'Окно',role:'window',defaultOpening:'op_tilt_turn',ratio:.58},{label:'Балконная дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.42}]},
      {id:'sc_bb_window_right',name:'Дверь слева + окно справа',desc:'Зеркальная компоновка.',mechanism:'standard',sections:[{label:'Балконная дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.42},{label:'Окно',role:'window',defaultOpening:'op_tilt_turn',ratio:.58}]},
      {id:'sc_bb_double_window',name:'2 окна + дверь',desc:'Расширенная оконная часть.',mechanism:'standard',sections:[{label:'Окно 1',role:'window',defaultOpening:'op_fixed',ratio:.3},{label:'Окно 2',role:'window',defaultOpening:'op_tilt_turn',ratio:.3},{label:'Балконная дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.4}]}
    ],
    ct_panoramic_door:[
      {id:'sc_pd_swing',name:'Распашная панорамная дверь',desc:'Тёплая алюминиевая распашная дверь.',mechanism:'swing_door',sections:[{label:'Дверь',role:'entrance_door',defaultOpening:'op_turn',ratio:1}]},
      {id:'sc_pd_psk',name:'PSK-панорамная дверь',desc:'Параллельно-сдвижной ПВХ-выход.',mechanism:'psk',sections:[{label:'Активная створка',role:'portal',defaultOpening:'op_psk',ratio:.5},{label:'Глухая часть',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]},
      {id:'sc_pd_lift_slide',name:'Подъёмно-сдвижная дверь',desc:'Большой алюминиевый выход на террасу.',mechanism:'lift_slide',sections:[{label:'Активная створка',role:'portal',defaultOpening:'op_lift_slide',ratio:.5},{label:'Глухая часть',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]}
    ]
  };

  const openingOptions=[
    {id:'op_fixed',name:'Глухая',short:'Не открывается'},
    {id:'op_turn',name:'Поворотная',short:'Открывается внутрь'},
    {id:'op_tilt_turn',name:'Поворотно-откидная',short:'Открывание + проветривание',recommended:true},
    {id:'op_tilt',name:'Откидная',short:'Только проветривание'},
    {id:'op_psk',name:'PSK',short:'Параллельно-сдвижная'},
    {id:'op_lift_slide',name:'Подъёмно-сдвижная',short:'Для больших порталов'}
  ];

  const materials=[
    {id:'mat_pvc',name:'ПВХ / REHAU',short:'ПВХ',desc:'Тёплое классическое решение.'},
    {id:'mat_aluminum',name:'Алюминий / ALUMARK',short:'Алюминий',desc:'Тонкий профиль и современная архитектура.'}
  ];

  const glazing=[
    {id:'gl_single_glass',name:'Одинарное стекло',short:'1 стекло',desc:'Только для холодного алюминиевого остекления.'},
    {id:'gl_1ch',name:'Однокамерный',short:'2 стекла · 1 камера',desc:'Базовый стеклопакет.'},
    {id:'gl_2ch',name:'Двухкамерный',short:'3 стекла · 2 камеры',desc:'Больше возможностей по теплу и акустике.'}
  ];

  const comfort=[
    {id:'cf_none',name:'Без дополнительных свойств',short:'Стандарт',desc:'Базовая прозрачная формула.',properties:[]},
    {id:'cf_warm',name:'Тепло',short:'Энергосбережение',desc:'Приоритет тепла.',properties:['thermal']},
    {id:'cf_quiet',name:'Тишина',short:'Акустика',desc:'Приоритет шумоизоляции.',properties:['acoustic']},
    {id:'cf_solar',name:'Защита от солнца',short:'Солнцезащита',desc:'Меньше солнечного перегрева.',properties:['solar']},
    {id:'cf_yearround',name:'Комфорт круглый год',short:'Тепло + солнце',desc:'Энергосбережение и солнцезащита.',properties:['thermal','solar']},
    {id:'cf_safe',name:'Безопасность',short:'Триплекс',desc:'Ламинированное безопасное стекло.',properties:['safety']},
    {id:'cf_quiet_safe',name:'Тишина + безопасность',short:'Акустический триплекс',desc:'Акустика и безопасность.',properties:['acoustic','safety']},
    {id:'cf_crystal',name:'Максимум света',short:'Crystal',desc:'Осветлённое стекло.',properties:['clarity']}
  ];

  const systems=[
    {id:'sys_blitz',name:'REHAU BLITZ',brand:'REHAU',material:'mat_pvc',thermalModes:['mode_warm'],tag:'Доступнее',depth:'60 мм',detail:'3 камеры профиля',filling:'ориентир до ~32 мм',thermal:'R≈0,70',acoustic:'до класса B',mechanisms:['standard','psk'],constructionTypes:['ct_window','ct_panoramic','ct_balcony_block','ct_panoramic_door'],scores:{value:5,thermal:2,acoustic:2,panoramic:2}},
    {id:'sys_grazio',name:'REHAU GRAZIO',brand:'REHAU',material:'mat_pvc',thermalModes:['mode_warm'],tag:'Оптимальный',depth:'70 мм',detail:'5 камер профиля',filling:'ориентир до ~40 мм',thermal:'R≈0,85',acoustic:'до класса B',mechanisms:['standard','psk'],constructionTypes:['ct_window','ct_panoramic','ct_balcony_block','ct_panoramic_door'],scores:{value:4,thermal:4,acoustic:3,panoramic:3}},
    {id:'sys_intelio80',name:'REHAU INTELIO 80',brand:'REHAU',material:'mat_pvc',thermalModes:['mode_warm'],tag:'Максимальный комфорт',depth:'80 мм',detail:'6 камер профиля',filling:'до 53 мм',thermal:'R≈0,99',acoustic:'до 45 дБА*',mechanisms:['standard','psk'],constructionTypes:['ct_window','ct_panoramic','ct_balcony_block','ct_panoramic_door'],scores:{value:2,thermal:5,acoustic:5,panoramic:4}},
    {id:'sys_s50',name:'ALUMARK S50',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_cold'],tag:'Холодное',depth:'50 мм',detail:'без терморазрыва',filling:'4–36 мм',thermal:'без теплоизоляции',acoustic:'по паспорту',mechanisms:['standard'],constructionTypes:['ct_window','ct_panoramic'],scores:{value:5,thermal:1,acoustic:2,panoramic:4}},
    {id:'sys_s60',name:'ALUMARK S60',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_warm'],tag:'Тёплое',depth:'60 мм',detail:'с терморазрывом',filling:'окно 30–52 мм; дверь 20–42 мм',thermal:'R₀≈0,80',acoustic:'RA,trans≈32,1 дБА',mechanisms:['standard','swing_door'],constructionTypes:['ct_window','ct_panoramic','ct_balcony_block','ct_panoramic_door'],scores:{value:4,thermal:4,acoustic:3,panoramic:4}},
    {id:'sys_s70',name:'ALUMARK S70',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_warm'],tag:'Тёплое усиленное',depth:'70 мм',detail:'с терморазрывом',filling:'окно 20–60 мм; дверь 10–50 мм',thermal:'R₀≈0,89',acoustic:'Rw≈33 дБ',mechanisms:['standard','swing_door'],constructionTypes:['ct_window','ct_panoramic','ct_balcony_block','ct_panoramic_door'],scores:{value:2,thermal:5,acoustic:4,panoramic:5}},
    {id:'sys_s158',name:'ALUMARK S158',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_warm'],tag:'Подъёмно-сдвижное',depth:'158 / 246 мм',detail:'портальная система',filling:'10–50 мм',thermal:'Uw < 1,8',acoustic:'Rw≈40 дБ',mechanisms:['lift_slide'],constructionTypes:['ct_panoramic','ct_panoramic_door'],scores:{value:1,thermal:4,acoustic:5,panoramic:5}}
  ];

  const extras=[
    {id:'ex_mosquito',name:'Москитная сетка',price:'от 1 500 ₽',desc:'Для подходящей открывающейся створки.'},
    {id:'ex_sill',name:'Подоконник',price:'от 300 ₽/м',desc:'Внутренний подоконник.'},
    {id:'ex_drip',name:'Отлив',price:'по расчёту',desc:'Наружный водоотлив.'},
    {id:'ex_slopes',name:'Откосы',price:'от 800 ₽/пог. м',desc:'Отделка проёма.'},
    {id:'ex_child_lock',name:'Детский замок',price:'по расчёту',desc:'Блокировка створки.'},
    {id:'ex_limiter',name:'Ограничитель',price:'по расчёту',desc:'Ограничивает угол открытия.'},
    {id:'ex_install',name:'Монтаж',price:'по расчёту',desc:'Установка конструкции.'},
    {id:'ex_delivery',name:'Доставка',price:'по адресу',desc:'Доставка на объект.'}
  ];

  const installationContexts=[
    {id:'ctx_ground',name:'Первый этаж'},
    {id:'ctx_upper',name:'Выше первого этажа'},
    {id:'ctx_balcony',name:'Выход на остеклённый балкон / лоджию'},
    {id:'ctx_house',name:'Частный дом'}
  ];

  return Object.freeze({types,schemes,openingOptions,materials,glazing,comfort,systems,extras,installationContexts});
});