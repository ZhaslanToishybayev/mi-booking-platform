<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $events = [
            // Concerts
            [
                'title' => 'Концерт группы ЛСП',
                'description' => 'Большой сольный концерт в Крокус Сити Холле. Новая программа 2026! Живой звук, световое шоу и все хиты.',
                'location' => 'Москва, Крокус Сити Холл',
                'days_offset' => 40,
                'time_start' => '19:00',
                'time_end' => '22:00',
                'tickets' => [
                    ['name' => 'VIP', 'price' => 8000, 'qty' => 100, 'avail' => 50],
                    ['name' => 'Танцпол', 'price' => 4000, 'qty' => 500, 'avail' => 200],
                    ['name' => 'Фан-зона', 'price' => 5500, 'qty' => 150, 'avail' => 30],
                ]
            ],
            [
                'title' => 'Симфонический оркестр: Шедевры классики',
                'description' => 'Вечер классической музыки. В программе произведения Моцарта, Бетховена и Чайковского в исполнении государственного симфонического оркестра.',
                'location' => 'Москва, Консерватория им. Чайковского',
                'days_offset' => 15,
                'time_start' => '18:00',
                'time_end' => '20:30',
                'tickets' => [
                    ['name' => 'Партер', 'price' => 5000, 'qty' => 50, 'avail' => 20],
                    ['name' => 'Амфитеатр', 'price' => 2000, 'qty' => 300, 'avail' => 150],
                    ['name' => 'Балкон', 'price' => 1000, 'qty' => 100, 'avail' => 80],
                ]
            ],
            
            // Stand-up
            [
                'title' => 'Stand-up: Нурлан Сабуров',
                'description' => 'Новый сольный концерт "Принципы". Острый юмор, живое общение с залом и новые шутки.',
                'location' => 'Санкт-Петербург, Ледовый дворец',
                'days_offset' => 45,
                'time_start' => '20:00',
                'time_end' => '22:00',
                'tickets' => [
                    ['name' => 'VIP', 'price' => 15000, 'qty' => 50, 'avail' => 10],
                    ['name' => 'Партер', 'price' => 5000, 'qty' => 800, 'avail' => 300],
                    ['name' => 'Трибуна', 'price' => 3000, 'qty' => 1000, 'avail' => 500],
                ]
            ],
            [
                'title' => 'Открытый микрофон: Лучшее',
                'description' => 'Выступление лучших комиков проекта "Открытый микрофон". Смешно, дерзко и актуально.',
                'location' => 'Москва, StandUp Store Moscow',
                'days_offset' => 5,
                'time_start' => '21:00',
                'time_end' => '23:00',
                'tickets' => [
                    ['name' => 'Входной', 'price' => 1500, 'qty' => 100, 'avail' => 45],
                ]
            ],

            // Festivals
            [
                'title' => 'Фестиваль электронной музыки AFP',
                'description' => 'ALFA FUTURE PEOPLE 2026 - крупнейший фестиваль электронной музыки и технологий. 3 дня, 5 сцен, 100 диджеев.',
                'location' => 'Нижний Новгород, Стрелка',
                'days_offset' => 120,
                'time_start' => '14:00',
                'time_end' => '23:00',
                'tickets' => [
                    ['name' => 'VIP', 'price' => 15000, 'qty' => 200, 'avail' => 100],
                    ['name' => 'Стандарт', 'price' => 7000, 'qty' => 2000, 'avail' => 1500],
                    ['name' => 'Кемпинг', 'price' => 3000, 'qty' => 500, 'avail' => 200],
                ]
            ],
            [
                'title' => 'VK Fest 2026',
                'description' => 'Главный городской опен-эйр страны. Музыка, блогеры, технологии, спорт и развлечения.',
                'location' => 'Санкт-Петербург, Парк 300-летия',
                'days_offset' => 90,
                'time_start' => '12:00',
                'time_end' => '22:00',
                'tickets' => [
                    ['name' => 'Входной', 'price' => 3500, 'qty' => 5000, 'avail' => 3000],
                    ['name' => 'Детский', 'price' => 1500, 'qty' => 1000, 'avail' => 500],
                ]
            ],

            // Theater
            [
                'title' => 'Спектакль "Мастер и Маргарита"',
                'description' => 'Легендарная постановка по роману М.А. Булгакова. Мистика, любовь и философия на большой сцене.',
                'location' => 'Москва, МХАТ им. Горького',
                'days_offset' => 20,
                'time_start' => '19:00',
                'time_end' => '22:30',
                'tickets' => [
                    ['name' => 'Партер', 'price' => 6000, 'qty' => 100, 'avail' => 40],
                    ['name' => 'Амфитеатр', 'price' => 3000, 'qty' => 200, 'avail' => 120],
                    ['name' => 'Бельэтаж', 'price' => 1500, 'qty' => 150, 'avail' => 80],
                ]
            ],

            // Exhibitions
            [
                'title' => 'Выставка современного искусства "Космос"',
                'description' => 'Иммерсивная выставка о будущем, космосе и технологиях. Виртуальная реальность, инсталляции и перформансы.',
                'location' => 'Москва, Центр Марс',
                'days_offset' => 2,
                'time_start' => '10:00',
                'time_end' => '21:00',
                'tickets' => [
                    ['name' => 'Стандарт', 'price' => 900, 'qty' => 1000, 'avail' => 950],
                    ['name' => 'Льготный', 'price' => 500, 'qty' => 500, 'avail' => 480],
                ]
            ],

            // Cinema
            [
                'title' => 'Премьера фильма "Дюна: Часть 3"',
                'description' => 'Эксклюзивный показ долгожданного продолжения фантастической саги. IMAX 3D.',
                'location' => 'Москва, КАРО 11 Октябрь',
                'days_offset' => 10,
                'time_start' => '20:00',
                'time_end' => '23:00',
                'tickets' => [
                    ['name' => 'VIP', 'price' => 2000, 'qty' => 50, 'avail' => 10],
                    ['name' => 'Стандарт', 'price' => 800, 'qty' => 300, 'avail' => 150],
                ]
            ],
        ];

        foreach ($events as $eventData) {
            $start = now()->addDays($eventData['days_offset']);
            // Parse times
            [$hStart, $mStart] = explode(':', $eventData['time_start']);
            [$hEnd, $mEnd] = explode(':', $eventData['time_end']);
            
            $startDate = (clone $start)->setTime((int)$hStart, (int)$mStart);
            $endDate = (clone $start)->setTime((int)$hEnd, (int)$mEnd);

            $event = Event::create([
                'title' => $eventData['title'],
                'description' => $eventData['description'],
                'location' => $eventData['location'],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active',
                // We leave image_url null to let frontend helper pick image by title keywords
                'image_url' => null, 
            ]);

            foreach ($eventData['tickets'] as $ticketData) {
                TicketType::create([
                    'event_id' => $event->id,
                    'name' => $ticketData['name'],
                    'price' => $ticketData['price'],
                    'quantity' => $ticketData['qty'],
                    'available' => $ticketData['avail'],
                ]);
            }
        }
    }
}
