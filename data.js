  const types = [
    {id:'ct_single',name:'Одностворчатое',desc:'Компактное окно с одной основной створкой.'},
    {id:'ct_double',name:'Двухстворчатое',desc:'Классическая конструкция из двух секций.'},
    {id:'ct_panoramic',name:'Панорамное',desc:'Большая площадь остекления и максимум света.'},
    {id:'ct_balcony_block',name:'Балконный блок',desc:'Окно и балконная дверь в одной конструкции.'},
    {id:'ct_balcony_glazing',name:'Балкон / лоджия',desc:'Полное многосекционное остекление.'},
    {id:'ct_entrance',name:'Входная группа',desc:'Распашная дверь или панорамный выход.'}
  ];

  const schemes = {
    ct_single:[
      {id:'sc_single_1',name:'1 секция',desc:'Одна цельная оконная секция.',sections:[{label:'Створка',role:'window',opening:'op_tilt_turn'}]},
      {id:'sc_single_transom',name:'Створка + фрамуга',desc:'Основная створка и верхняя фрамуга.',sections:[{label:'Основная створка',role:'window',opening:'op_tilt_turn'},{label:'Фрамуга',role:'transom',opening:'op_tilt'}]}
    ],
    ct_double:[
      {id:'sc_double_fixed_left',name:'Глухая + открывающаяся',desc:'Слева глухая, справа активная.',sections:[{label:'Левая',role:'window',opening:'op_fixed'},{label:'Правая',role:'window',opening:'op_tilt_turn'}]},
      {id:'sc_double_fixed_right',name:'Открывающаяся + глухая',desc:'Слева активная, справа глухая.',sections:[{label:'Левая',role:'window',opening:'op_tilt_turn'},{label:'Правая',role:'window',opening:'op_fixed'}]},
      {id:'sc_double_both_active',name:'Обе открывающиеся',desc:'Обе створки можно открыть.',sections:[{label:'Левая',role:'window',opening:'op_turn'},{label:'Правая',role:'window',opening:'op_tilt_turn'}]},
      {id:'sc_double_both_fixed',name:'Обе глухие',desc:'Две секции без открывания.',sections:[{label:'Левая',role:'window',opening:'op_fixed'},{label:'Правая',role:'window',opening:'op_fixed'}]}
    ],
    ct_panoramic:[
      {id:'sc_pan_fixed',name:'Глухая панорама',desc:'Максимальная площадь стекла.',sections:[{label:'Панорама',role:'window',opening:'op_fixed'}]},
      {id:'sc_pan_2',name:'2 секции',desc:'Глухая + открывающаяся.',sections:[{label:'Левая',role:'window',opening:'op_fixed'},{label:'Правая',role:'window',opening:'op_tilt_turn'}]},
      {id:'sc_pan_3',name:'3 секции',desc:'Три секции для широкого проёма.',sections:[{label:'Левая',role:'window',opening:'op_fixed'},{label:'Центральная',role:'window',opening:'op_tilt_turn'},{label:'Правая',role:'window',opening:'op_fixed'}]},
      {id:'sc_pan_multi',name:'Многосекционное',desc:'Для очень широких проёмов.',sections:[{label:'1',role:'window',opening:'op_fixed'},{label:'2',role:'window',opening:'op_tilt_turn'},{label:'3',role:'window',opening:'op_fixed'},{label:'4',role:'window',opening:'op_fixed'}]},
      {id:'sc_pan_psk',name:'PSK-портал',desc:'Параллельно-сдвижной ПВХ-портал.',sections:[{label:'Активная створка',role:'portal',opening:'op_psk'},{label:'Глухая часть',role:'portal',opening:'op_fixed'}]},
      {id:'sc_pan_lift_slide',name:'Подъёмно-сдвижной портал',desc:'Большой алюминиевый портал.',sections:[{label:'Активная створка',role:'portal',opening:'op_lift_slide'},{label:'Глухая часть',role:'portal',opening:'op_fixed'}]}
    ],
    ct_balcony_block:[
      {id:'sc_bb_window_left',name:'Окно слева + дверь справа',desc:'Классическая компоновка.',sections:[{label:'Окно',role:'window',opening:'op_tilt_turn'},{label:'Дверь',role:'door',opening:'op_turn'}]},
      {id:'sc_bb_window_right',name:'Дверь слева + окно справа',desc:'Зеркальная компоновка.',sections:[{label:'Дверь',role:'door',opening:'op_turn'},{label:'Окно',role:'window',opening:'op_tilt_turn'}]},
      {id:'sc_bb_double_window',name:'2 окна + дверь',desc:'Расширенная оконная часть.',sections:[{label:'Окно 1',role:'window',opening:'op_fixed'},{label:'Окно 2',role:'window',opening:'op_tilt_turn'},{label:'Дверь',role:'door',opening:'op_turn'}]},
      {id:'sc_bb_fixed_window',name:'Глухое окно + дверь',desc:'Окно без открывания.',sections:[{label:'Окно',role:'window',opening:'op_fixed'},{label:'Дверь',role:'door',opening:'op_turn'}]},
      {id:'sc_bb_active_window',name:'Открывающееся окно + дверь',desc:'Окно с проветриванием.',sections:[{label:'Окно',role:'window',opening:'op_tilt_turn'},{label:'Дверь',role:'door',opening:'op_turn'}]}
    ],
    ct_balcony_glazing:[
      {id:'sc_bg_straight_2',name:'Прямое · 2 секции',desc:'Две секции в одну линию.',sections:[{label:'1',role:'window',opening:'op_fixed'},{label:'2',role:'window',opening:'op_tilt_turn'}]},
      {id:'sc_bg_straight_3',name:'Прямое · 3 секции',desc:'Три секции в одну линию.',sections:[{label:'1',role:'window',opening:'op_fixed'},{label:'2',role:'window',opening:'op_tilt_turn'},{label:'3',role:'window',opening:'op_fixed'}]},
      {id:'sc_bg_straight_4',name:'Прямое · 4 секции',desc:'Четыре секции в одну линию.',sections:[{label:'1',role:'window',opening:'op_fixed'},{label:'2',role:'window',opening:'op_tilt_turn'},{label:'3',role:'window',opening:'op_fixed'},{label:'4',role:'window',opening:'op_fixed'}]},
      {id:'sc_bg_straight_5plus',name:'Прямое · 5+ секций',desc:'Многосекционное остекление.',sections:[{label:'1',role:'window',opening:'op_fixed'},{label:'2',role:'window',opening:'op_tilt_turn'},{label:'3',role:'window',opening:'op_fixed'},{label:'4',role:'window',opening:'op_fixed'},{label:'5',role:'window',opening:'op_fixed'}]},
      {id:'sc_bg_l',name:'Г-образное',desc:'Остекление с одним углом.',sections:[{label:'Фасад 1',role:'window',opening:'op_tilt_turn'},{label:'Фасад 2',role:'window',opening:'op_fixed'},{label:'Фасад 3',role:'window',opening:'op_fixed'}]},
      {id:'sc_bg_u',name:'П-образное',desc:'Остекление по трём сторонам.',sections:[{label:'Левая',role:'window',opening:'op_fixed'},{label:'Центр',role:'window',opening:'op_tilt_turn'},{label:'Правая',role:'window',opening:'op_fixed'}]}
    ],
    ct_entrance:[
      {id:'sc_en_single',name:'Одна распашная дверь',desc:'Одна входная створка.',sections:[{label:'Дверь',role:'door',opening:'op_turn'}]},
      {id:'sc_en_side',name:'Дверь + боковая секция',desc:'Дверь и глухое боковое стекло.',sections:[{label:'Дверь',role:'door',opening:'op_turn'},{label:'Боковая',role:'window',opening:'op_fixed'}]},
      {id:'sc_en_double',name:'Двустворчатая дверь',desc:'Две распашные створки.',sections:[{label:'Левая дверь',role:'door',opening:'op_turn'},{label:'Правая дверь',role:'door',opening:'op_turn'}]},
      {id:'sc_en_two_sides',name:'Дверь + 2 боковые секции',desc:'Центральная дверь и боковые стекла.',sections:[{label:'Левая',role:'window',opening:'op_fixed'},{label:'Дверь',role:'door',opening:'op_turn'},{label:'Правая',role:'window',opening:'op_fixed'}]},
      {id:'sc_en_transom',name:'Дверь + фрамуга',desc:'Входная дверь с верхней фрамугой.',sections:[{label:'Дверь',role:'door',opening:'op_turn'},{label:'Фрамуга',role:'transom',opening:'op_fixed'}]},
      {id:'sc_en_psk',name:'PSK-панорамная дверь',desc:'ПВХ-выход на террасу.',sections:[{label:'Активная',role:'portal',opening:'op_psk'},{label:'Глухая',role:'portal',opening:'op_fixed'}]},
      {id:'sc_en_lift_slide',name:'Подъёмно-сдвижная дверь',desc:'Большой алюминиевый выход.',sections:[{label:'Активная',role:'portal',opening:'op_lift_slide'},{label:'Глухая',role:'portal',opening:'op_fixed'}]}
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
    {id:'mat_aluminum',name:'Алюминий / ALUMARK',short:'Алюминий',desc:'Тонкий профиль, большие размеры, современная архитектура.'}
  ];

  const glazing = [
    {id:'gl_single_glass',name:'Одинарное стекло',short:'1 стекло',desc:'Только для холодного алюминиевого остекления.'},
    {id:'gl_1ch',name:'Однокамерный',short:'2 стекла · 1 камера',desc:'Базовый вариант.'},
    {id:'gl_2ch',name:'Двухкамерный',short:'3 стекла · 2 камеры',desc:'Больше тепла и тишины.'}
  ];

  const comfort = [
    {id:'cf_none',name:'Без дополнительных свойств',short:'Стандарт',desc:'Базовое прозрачное стекло.'},
    {id:'cf_warm',name:'Теплее',short:'Low‑E',desc:'Энергосберегающее покрытие.'},
    {id:'cf_quiet',name:'Тише',short:'Акустика',desc:'Акустическая формула.'},
    {id:'cf_solar',name:'Защита от солнца',short:'Солнцезащита',desc:'Меньше солнечного перегрева.'},
    {id:'cf_yearround',name:'Комфорт круглый год',short:'Тепло + солнце',desc:'Энергосбережение + солнцезащита.'},
    {id:'cf_safe',name:'Безопасность',short:'Триплекс',desc:'Ламинированное безопасное стекло.'},
    {id:'cf_quiet_safe',name:'Тишина + безопасность',short:'Акустический триплекс',desc:'Тише на улице + безопасное стекло.'},
    {id:'cf_crystal',name:'Максимум света',short:'Crystal',desc:'Осветлённое стекло.'}
  ];

  const systems = [
    {id:'sys_blitz',name:'REHAU BLITZ',material:'mat_pvc',tag:'Доступнее',depth:'60 мм',detail:'3 камеры профиля',filling:'до ~32 мм',thermal:'R≈0,70',acoustic:'класс B',desc:'Базовый ПВХ для стандартных окон.'},
    {id:'sys_grazio',name:'REHAU GRAZIO',material:'mat_pvc',tag:'Рекомендуем',depth:'70 мм',detail:'5 камер профиля',filling:'до ~40 мм',thermal:'R≈0,85',acoustic:'класс B',desc:'Тёплый универсальный вариант для квартиры и дома.'},
    {id:'sys_intelio80',name:'REHAU INTELIO 80',material:'mat_pvc',tag:'Максимальный комфорт',depth:'80 мм',detail:'6 камер профиля',filling:'до 53 мм',thermal:'R≈0,99',acoustic:'до 45 дБА*',desc:'Для повышенных требований к теплу и тишине.'},
    {id:'sys_s50',name:'ALUMARK S50',material:'mat_aluminum',tag:'Холодное',depth:'50 мм',detail:'без терморазрыва',filling:'4–36 мм',thermal:'холодная система',acoustic:'по паспорту',desc:'Лоджии, витражи и перегородки без требований к теплоизоляции.'},
    {id:'sys_s60',name:'ALUMARK S60',material:'mat_aluminum',tag:'Тёплое',depth:'60 мм',detail:'с терморазрывом',filling:'30–52 мм',thermal:'R₀≈0,80',acoustic:'≈32,1 дБА',desc:'Универсальный тёплый алюминий для окон и дверей.'},
    {id:'sys_s70',name:'ALUMARK S70',material:'mat_aluminum',tag:'Тёплое усиленное',depth:'70 мм',detail:'с терморазрывом',filling:'20–60 мм',thermal:'R₀≈0,89',acoustic:'Rw≈33 дБ',desc:'Для крупных и более требовательных конструкций.'},
    {id:'sys_s158',name:'ALUMARK S158',material:'mat_aluminum',tag:'Подъёмно-сдвижное',depth:'158 / 246 мм',detail:'портальная система',filling:'10–50 мм',thermal:'Uw < 1,8',acoustic:'Rw≈40 дБ',desc:'Большие подъёмно-сдвижные порталы; створка до 400 кг.'}
  ];

  const extras = [
    {id:'ex_mosquito',name:'Москитная сетка',price:'от 1 500 ₽',desc:'Для открывающихся окон.'},
    {id:'ex_sill',name:'Подоконник',price:'от 300 ₽/м',desc:'Внутренний подоконник.'},
    {id:'ex_drip',name:'Отлив',price:'по расчёту',desc:'Наружный водоотлив.'},
    {id:'ex_slopes',name:'Откосы',price:'от 800 ₽/пог. м',desc:'Отделка оконного проёма.'},
    {id:'ex_child_lock',name:'Детский замок',price:'по расчёту',desc:'Блокировка открытия створки.'},
    {id:'ex_limiter',name:'Ограничитель',price:'по расчёту',desc:'Ограничивает угол открытия.'},
    {id:'ex_install',name:'Монтаж',price:'по расчёту',desc:'Профессиональная установка.'},
    {id:'ex_delivery',name:'Доставка',price:'по адресу',desc:'Доставка на объект.'}
  ];

  const stepMeta = [
    {id:'type',n:1,title:'Тип конструкции',subtitle:'Выберите, что именно нужно установить.'},
    {id:'scheme',n:2,title:'Схема окна / секций',subtitle:'Выберите количество и расположение секций.'},
    {id:'opening',n:3,title:'Открывание створок',subtitle:'Настройте открывание только для активных секций.'},
    {id:'material',n:4,title:'Материал',subtitle:'ПВХ или алюминий — дальше покажем только совместимые системы.'},
    {id:'glazing',n:5,title:'Стеклопакет',subtitle:'Это конструкция стеклопакета, а не «камеры профиля».'},
    {id:'comfort',n:6,title:'Комфорт',subtitle:'Необязательно. Выберите один готовый пакет свойств.'},
    {id:'systems',n:'✓',title:'Подходящие системы',subtitle:'Мы уже отфильтровали несовместимые варианты.'},
    {id:'extras',n:7,title:'Комплектация',subtitle:'Добавьте только нужные опции и услуги.'}
  ];
