(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.LUMI_DATA = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const types = [
    {id:'ct_single',name:'Одностворчатое',desc:'Компактное окно с одной основной створкой.'},
    {id:'ct_double',name:'Двухстворчатое',desc:'Классическая конструкция из двух секций.'},
    {id:'ct_panoramic',name:'Панорамное',desc:'Большая площадь остекления и максимум света.'},
    {id:'ct_balcony_block',name:'Балконный блок',desc:'Окно и балконная дверь в одной конструкции.'},
    {id:'ct_balcony_glazing',name:'Балкон / лоджия',desc:'Полное многосекционное остекление.'},
    {id:'ct_entrance',name:'Входная группа',desc:'Распашная дверь или панорамный выход.'}
  ];

  // section.role drives opening rules; ratio is used only for visual preview.
  const schemes = {
    ct_single:[
      {id:'sc_single_1',name:'1 секция',desc:'Одна цельная оконная секция.',mechanism:'standard',layout:'linear',sections:[{label:'Створка',role:'window',defaultOpening:'op_tilt_turn',ratio:1}]},
      {id:'sc_single_transom',name:'Створка + фрамуга',desc:'Основная створка и верхняя фрамуга.',mechanism:'standard',layout:'transom',sections:[{label:'Основная створка',role:'window',defaultOpening:'op_tilt_turn',ratio:.78},{label:'Фрамуга',role:'transom',defaultOpening:'op_tilt',ratio:.22}]}
    ],
    ct_double:[
      {id:'sc_double_fixed_left',name:'Глухая + открывающаяся',desc:'Слева глухая, справа активная.',mechanism:'standard',layout:'linear',sections:[{label:'Левая',role:'window',defaultOpening:'op_fixed',ratio:.5},{label:'Правая',role:'window',defaultOpening:'op_tilt_turn',ratio:.5}]},
      {id:'sc_double_fixed_right',name:'Открывающаяся + глухая',desc:'Слева активная, справа глухая.',mechanism:'standard',layout:'linear',sections:[{label:'Левая',role:'window',defaultOpening:'op_tilt_turn',ratio:.5},{label:'Правая',role:'window',defaultOpening:'op_fixed',ratio:.5}]},
      {id:'sc_double_both_active',name:'Обе открывающиеся',desc:'Обе створки можно открыть.',mechanism:'standard',layout:'linear',sections:[{label:'Левая',role:'window',defaultOpening:'op_turn',ratio:.5},{label:'Правая',role:'window',defaultOpening:'op_tilt_turn',ratio:.5}]},
      {id:'sc_double_both_fixed',name:'Обе глухие',desc:'Две секции без открывания.',mechanism:'standard',layout:'linear',sections:[{label:'Левая',role:'window',defaultOpening:'op_fixed',ratio:.5},{label:'Правая',role:'window',defaultOpening:'op_fixed',ratio:.5}]}
    ],
    ct_panoramic:[
      {id:'sc_pan_fixed',name:'Глухая панорама',desc:'Максимальная площадь стекла.',mechanism:'standard',layout:'linear',sections:[{label:'Панорама',role:'window',defaultOpening:'op_fixed',ratio:1}]},
      {id:'sc_pan_2',name:'2 секции',desc:'Глухая + открывающаяся.',mechanism:'standard',layout:'linear',sections:[{label:'Левая',role:'window',defaultOpening:'op_fixed',ratio:.58},{label:'Правая',role:'window',defaultOpening:'op_tilt_turn',ratio:.42}]},
      {id:'sc_pan_3',name:'3 секции',desc:'Три секции для широкого проёма.',mechanism:'standard',layout:'linear',sections:[{label:'Левая',role:'window',defaultOpening:'op_fixed',ratio:.33},{label:'Центральная',role:'window',defaultOpening:'op_tilt_turn',ratio:.34},{label:'Правая',role:'window',defaultOpening:'op_fixed',ratio:.33}]},
      {id:'sc_pan_multi',name:'Многосекционное',desc:'Для очень широких проёмов.',mechanism:'standard',layout:'linear',sections:[{label:'1',role:'window',defaultOpening:'op_fixed',ratio:.25},{label:'2',role:'window',defaultOpening:'op_tilt_turn',ratio:.25},{label:'3',role:'window',defaultOpening:'op_fixed',ratio:.25},{label:'4',role:'window',defaultOpening:'op_fixed',ratio:.25}]},
      {id:'sc_pan_psk',name:'PSK-портал',desc:'Параллельно-сдвижной ПВХ-портал.',mechanism:'psk',layout:'linear',allowedMaterials:['mat_pvc'],sections:[{label:'Активная створка',role:'portal',defaultOpening:'op_psk',ratio:.5},{label:'Глухая часть',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]},
      {id:'sc_pan_lift_slide',name:'Подъёмно-сдвижной портал',desc:'Большой алюминиевый портал.',mechanism:'lift_slide',layout:'linear',allowedMaterials:['mat_aluminum'],sections:[{label:'Активная створка',role:'portal',defaultOpening:'op_lift_slide',ratio:.5},{label:'Глухая часть',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]}
    ],
    ct_balcony_block:[
      {id:'sc_bb_window_left',name:'Окно слева + дверь справа',desc:'Классическая компоновка.',mechanism:'standard',layout:'linear',sections:[{label:'Окно',role:'window',defaultOpening:'op_tilt_turn',ratio:.58},{label:'Дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.42}]},
      {id:'sc_bb_window_right',name:'Дверь слева + окно справа',desc:'Зеркальная компоновка.',mechanism:'standard',layout:'linear',sections:[{label:'Дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.42},{label:'Окно',role:'window',defaultOpening:'op_tilt_turn',ratio:.58}]},
      {id:'sc_bb_double_window',name:'2 окна + дверь',desc:'Расширенная оконная часть.',mechanism:'standard',layout:'linear',sections:[{label:'Окно 1',role:'window',defaultOpening:'op_fixed',ratio:.3},{label:'Окно 2',role:'window',defaultOpening:'op_tilt_turn',ratio:.3},{label:'Дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.4}]},
      {id:'sc_bb_fixed_window',name:'Глухое окно + дверь',desc:'Окно без открывания.',mechanism:'standard',layout:'linear',sections:[{label:'Окно',role:'window',defaultOpening:'op_fixed',ratio:.58},{label:'Дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.42}]},
      {id:'sc_bb_active_window',name:'Открывающееся окно + дверь',desc:'Окно с проветриванием.',mechanism:'standard',layout:'linear',sections:[{label:'Окно',role:'window',defaultOpening:'op_tilt_turn',ratio:.58},{label:'Дверь',role:'balcony_door',defaultOpening:'op_turn',ratio:.42}]}
    ],
    ct_balcony_glazing:[
      {id:'sc_bg_straight_2',name:'Прямое · 2 секции',desc:'Две секции в одну линию.',mechanism:'standard',layout:'linear',sections:[{label:'1',role:'window',defaultOpening:'op_fixed',ratio:.5},{label:'2',role:'window',defaultOpening:'op_tilt_turn',ratio:.5}]},
      {id:'sc_bg_straight_3',name:'Прямое · 3 секции',desc:'Три секции в одну линию.',mechanism:'standard',layout:'linear',sections:[{label:'1',role:'window',defaultOpening:'op_fixed',ratio:.33},{label:'2',role:'window',defaultOpening:'op_tilt_turn',ratio:.34},{label:'3',role:'window',defaultOpening:'op_fixed',ratio:.33}]},
      {id:'sc_bg_straight_4',name:'Прямое · 4 секции',desc:'Четыре секции в одну линию.',mechanism:'standard',layout:'linear',sections:[{label:'1',role:'window',defaultOpening:'op_fixed',ratio:.25},{label:'2',role:'window',defaultOpening:'op_tilt_turn',ratio:.25},{label:'3',role:'window',defaultOpening:'op_fixed',ratio:.25},{label:'4',role:'window',defaultOpening:'op_fixed',ratio:.25}]},
      {id:'sc_bg_straight_5plus',name:'Прямое · 5+ секций',desc:'Многосекционное остекление.',mechanism:'standard',layout:'linear',sections:[{label:'1',role:'window',defaultOpening:'op_fixed',ratio:.2},{label:'2',role:'window',defaultOpening:'op_tilt_turn',ratio:.2},{label:'3',role:'window',defaultOpening:'op_fixed',ratio:.2},{label:'4',role:'window',defaultOpening:'op_fixed',ratio:.2},{label:'5',role:'window',defaultOpening:'op_fixed',ratio:.2}]},
      {id:'sc_bg_l',name:'Г-образное',desc:'Остекление с одним углом.',mechanism:'standard',layout:'corner_l',sections:[{label:'Фасад 1',role:'window',defaultOpening:'op_tilt_turn',ratio:.42},{label:'Угол',role:'window',defaultOpening:'op_fixed',ratio:.16},{label:'Фасад 2',role:'window',defaultOpening:'op_fixed',ratio:.42}]},
      {id:'sc_bg_u',name:'П-образное',desc:'Остекление по трём сторонам.',mechanism:'standard',layout:'corner_u',sections:[{label:'Левая',role:'window',defaultOpening:'op_fixed',ratio:.28},{label:'Центр',role:'window',defaultOpening:'op_tilt_turn',ratio:.44},{label:'Правая',role:'window',defaultOpening:'op_fixed',ratio:.28}]}
    ],
    ct_entrance:[
      {id:'sc_en_single',name:'Одна распашная дверь',desc:'Одна входная створка.',mechanism:'swing_door',layout:'linear',allowedMaterials:['mat_aluminum'],sections:[{label:'Дверь',role:'entrance_door',defaultOpening:'op_turn',ratio:1}]},
      {id:'sc_en_side',name:'Дверь + боковая секция',desc:'Дверь и глухое боковое стекло.',mechanism:'swing_door',layout:'linear',allowedMaterials:['mat_aluminum'],sections:[{label:'Дверь',role:'entrance_door',defaultOpening:'op_turn',ratio:.58},{label:'Боковая',role:'window',defaultOpening:'op_fixed',ratio:.42}]},
      {id:'sc_en_double',name:'Двустворчатая дверь',desc:'Две распашные створки.',mechanism:'swing_door',layout:'linear',allowedMaterials:['mat_aluminum'],sections:[{label:'Левая дверь',role:'entrance_door',defaultOpening:'op_turn',ratio:.5},{label:'Правая дверь',role:'entrance_door',defaultOpening:'op_turn',ratio:.5}]},
      {id:'sc_en_two_sides',name:'Дверь + 2 боковые секции',desc:'Центральная дверь и боковые стекла.',mechanism:'swing_door',layout:'linear',allowedMaterials:['mat_aluminum'],sections:[{label:'Левая',role:'window',defaultOpening:'op_fixed',ratio:.25},{label:'Дверь',role:'entrance_door',defaultOpening:'op_turn',ratio:.5},{label:'Правая',role:'window',defaultOpening:'op_fixed',ratio:.25}]},
      {id:'sc_en_transom',name:'Дверь + фрамуга',desc:'Входная дверь с верхней фрамугой.',mechanism:'swing_door',layout:'transom',allowedMaterials:['mat_aluminum'],sections:[{label:'Дверь',role:'entrance_door',defaultOpening:'op_turn',ratio:.78},{label:'Фрамуга',role:'transom',defaultOpening:'op_fixed',ratio:.22}]},
      {id:'sc_en_psk',name:'PSK-панорамная дверь',desc:'ПВХ-выход на террасу.',mechanism:'psk',layout:'linear',allowedMaterials:['mat_pvc'],sections:[{label:'Активная',role:'portal',defaultOpening:'op_psk',ratio:.5},{label:'Глухая',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]},
      {id:'sc_en_lift_slide',name:'Подъёмно-сдвижная дверь',desc:'Большой алюминиевый выход.',mechanism:'lift_slide',layout:'linear',allowedMaterials:['mat_aluminum'],sections:[{label:'Активная',role:'portal',defaultOpening:'op_lift_slide',ratio:.5},{label:'Глухая',role:'portal_fixed',defaultOpening:'op_fixed',ratio:.5}]}
    ]
  };

  const openingOptions = [
    {id:'op_fixed',name:'Глухое',short:'Не открывается'},
    {id:'op_turn',name:'Поворотное',short:'Открывается'},
    {id:'op_tilt_turn',name:'Поворотно-откидное',short:'Открывается + проветривание'},
    {id:'op_tilt',name:'Откидное',short:'Проветривание'},
    {id:'op_psk',name:'PSK',short:'Параллельно-сдвижное'},
    {id:'op_lift_slide',name:'Подъёмно-сдвижное',short:'Большой портал'}
  ];

  const materials = [
    {id:'mat_pvc',name:'ПВХ / REHAU',short:'ПВХ',desc:'Тёплое классическое решение для квартиры и дома.'},
    {id:'mat_aluminum',name:'Алюминий / ALUMARK',short:'Алюминий',desc:'Тонкий профиль, большие конструкции и современная архитектура.'}
  ];

  const glazing = [
    {id:'gl_single_glass',name:'Одинарное стекло',short:'1 стекло',desc:'Только для холодного алюминиевого остекления.'},
    {id:'gl_1ch',name:'Однокамерный',short:'2 стекла · 1 камера',desc:'Базовая конструкция стеклопакета.'},
    {id:'gl_2ch',name:'Двухкамерный',short:'3 стекла · 2 камеры',desc:'Больше возможностей по теплу и акустике.'}
  ];

  // Comfort is UX intent. properties are technical semantics used by recommendation logic.
  const comfort = [
    {id:'cf_none',name:'Без дополнительных свойств',short:'Стандарт',desc:'Базовое прозрачное стекло.',properties:[]},
    {id:'cf_warm',name:'Теплее',short:'Low‑E',desc:'Энергосберегающее покрытие.',properties:['thermal']},
    {id:'cf_quiet',name:'Тише',short:'Акустика',desc:'Акустическая формула.',properties:['acoustic']},
    {id:'cf_solar',name:'Защита от солнца',short:'Солнцезащита',desc:'Меньше солнечного перегрева.',properties:['solar']},
    {id:'cf_yearround',name:'Комфорт круглый год',short:'Тепло + солнце',desc:'Энергосбережение + солнцезащита.',properties:['thermal','solar']},
    {id:'cf_safe',name:'Безопасность',short:'Триплекс',desc:'Ламинированное безопасное стекло.',properties:['safety']},
    {id:'cf_quiet_safe',name:'Тишина + безопасность',short:'Акустический триплекс',desc:'Акустика + безопасное ламинированное стекло.',properties:['acoustic','safety']},
    {id:'cf_crystal',name:'Максимум света',short:'Crystal',desc:'Осветлённое стекло.',properties:['clarity']}
  ];

  const systems = [
    {
      id:'sys_blitz',name:'REHAU BLITZ',brand:'REHAU',material:'mat_pvc',thermalModes:['mode_warm'],tag:'Доступнее',
      depth:'60 мм',detail:'3 камеры профиля',filling:'ориентир до ~32 мм',thermal:'R≈0,70',acoustic:'до класса B',
      desc:'Базовый ПВХ для стандартных окон.',mechanisms:['standard','psk'],
      constructionTypes:['ct_single','ct_double','ct_panoramic','ct_balcony_block','ct_balcony_glazing','ct_entrance'],
      roles:['window','transom','balcony_door','portal','portal_fixed'],scores:{value:5,thermal:2,acoustic:2,panoramic:2}
    },
    {
      id:'sys_grazio',name:'REHAU GRAZIO',brand:'REHAU',material:'mat_pvc',thermalModes:['mode_warm'],tag:'Оптимальный',
      depth:'70 мм',detail:'5 камер профиля',filling:'ориентир до ~40 мм',thermal:'R≈0,85',acoustic:'до класса B',
      desc:'Тёплый универсальный вариант для квартиры и дома.',mechanisms:['standard','psk'],
      constructionTypes:['ct_single','ct_double','ct_panoramic','ct_balcony_block','ct_balcony_glazing','ct_entrance'],
      roles:['window','transom','balcony_door','portal','portal_fixed'],scores:{value:4,thermal:4,acoustic:3,panoramic:3}
    },
    {
      id:'sys_intelio80',name:'REHAU INTELIO 80',brand:'REHAU',material:'mat_pvc',thermalModes:['mode_warm'],tag:'Максимальный комфорт',
      depth:'80 мм',detail:'6 камер профиля',filling:'до 53 мм',thermal:'R≈0,99',acoustic:'до 45 дБА*',
      desc:'Для повышенных требований к теплу и тишине.',mechanisms:['standard','psk'],
      constructionTypes:['ct_single','ct_double','ct_panoramic','ct_balcony_block','ct_balcony_glazing','ct_entrance'],
      roles:['window','transom','balcony_door','portal','portal_fixed'],scores:{value:2,thermal:5,acoustic:5,panoramic:4}
    },
    {
      id:'sys_s50',name:'ALUMARK S50',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_cold'],tag:'Холодное',
      depth:'50 мм',detail:'без терморазрыва',filling:'4–36 мм',thermal:'без теплоизоляции',acoustic:'по паспорту',
      desc:'Лоджии, витражи и перегородки без требований к теплоизоляции.',mechanisms:['standard','swing_door'],
      constructionTypes:['ct_single','ct_double','ct_panoramic','ct_balcony_glazing','ct_entrance'],
      roles:['window','transom','entrance_door'],scores:{value:5,thermal:1,acoustic:2,panoramic:4}
    },
    {
      id:'sys_s60',name:'ALUMARK S60',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_warm'],tag:'Тёплое',
      depth:'60 мм',detail:'с терморазрывом',filling:'окно 30–52 мм; дверь 20–42 мм',thermal:'R₀≈0,80',acoustic:'RA,trans≈32,1 дБА',
      desc:'Универсальный тёплый алюминий для окон и дверей.',mechanisms:['standard','swing_door'],
      constructionTypes:['ct_single','ct_double','ct_panoramic','ct_balcony_block','ct_balcony_glazing','ct_entrance'],
      roles:['window','transom','balcony_door','entrance_door'],scores:{value:4,thermal:4,acoustic:3,panoramic:4}
    },
    {
      id:'sys_s70',name:'ALUMARK S70',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_warm'],tag:'Тёплое усиленное',
      depth:'70 мм',detail:'с терморазрывом',filling:'окно 20–60 мм; дверь 10–50 мм',thermal:'R₀≈0,89',acoustic:'Rw≈33 дБ',
      desc:'Для крупных и более требовательных конструкций.',mechanisms:['standard','swing_door'],
      constructionTypes:['ct_single','ct_double','ct_panoramic','ct_balcony_block','ct_balcony_glazing','ct_entrance'],
      roles:['window','transom','balcony_door','entrance_door'],scores:{value:2,thermal:5,acoustic:4,panoramic:5}
    },
    {
      id:'sys_s158',name:'ALUMARK S158',brand:'ALUMARK',material:'mat_aluminum',thermalModes:['mode_warm'],tag:'Подъёмно-сдвижное',
      depth:'158 / 246 мм',detail:'портальная система',filling:'10–50 мм',thermal:'Uw < 1,8',acoustic:'Rw≈40 дБ',
      desc:'Большие подъёмно-сдвижные порталы; створка до 400 кг.',mechanisms:['lift_slide'],
      constructionTypes:['ct_panoramic','ct_entrance'],roles:['portal','portal_fixed'],scores:{value:1,thermal:4,acoustic:5,panoramic:5}
    }
  ];

  const extras = [
    {id:'ex_mosquito',name:'Москитная сетка',price:'от 1 500 ₽',desc:'Для открывающихся окон.',requires:'standard_active_window'},
    {id:'ex_sill',name:'Подоконник',price:'от 300 ₽/м',desc:'Внутренний подоконник.',requires:'window_sill'},
    {id:'ex_drip',name:'Отлив',price:'по расчёту',desc:'Наружный водоотлив.',requires:'exterior'},
    {id:'ex_slopes',name:'Откосы',price:'от 800 ₽/пог. м',desc:'Отделка оконного проёма.',requires:'installation'},
    {id:'ex_child_lock',name:'Детский замок',price:'по расчёту',desc:'Блокировка открытия створки.',requires:'lockable_window'},
    {id:'ex_limiter',name:'Ограничитель',price:'по расчёту',desc:'Ограничивает угол открытия.',requires:'turn_window'},
    {id:'ex_install',name:'Монтаж',price:'по расчёту',desc:'Профессиональная установка.',requires:'always'},
    {id:'ex_delivery',name:'Доставка',price:'по адресу',desc:'Доставка на объект.',requires:'always'}
  ];

  // Systems is a result stage, not an extra numbered user question.
  const stepMeta = [
    {id:'type',progress:1,title:'Тип конструкции',subtitle:'Выберите, что именно нужно установить.'},
    {id:'scheme',progress:2,title:'Схема окна / секций',subtitle:'Выберите количество и расположение секций.'},
    {id:'opening',progress:3,title:'Открывание створок',subtitle:'Настройте открывание каждой доступной секции.'},
    {id:'material',progress:4,title:'Материал',subtitle:'ПВХ или алюминий — несовместимые варианты будут скрыты.'},
    {id:'glazing',progress:5,title:'Стекло / стеклопакет',subtitle:'Количество камер стеклопакета — это не камеры профиля.'},
    {id:'comfort',progress:6,title:'Комфорт',subtitle:'Необязательно. Выберите один понятный пакет свойств.'},
    {id:'systems',progress:6,result:true,title:'Подходящие системы',subtitle:'Автоматически отфильтрованы по вашему сценарию.'},
    {id:'extras',progress:7,title:'Комплектация',subtitle:'Добавьте только нужные опции и услуги.'}
  ];

  return Object.freeze({types,schemes,openingOptions,materials,glazing,comfort,systems,extras,stepMeta});
});
