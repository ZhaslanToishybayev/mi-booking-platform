<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'tickets' => ['required', 'array', 'min:1'],
            'tickets.*.ticket_type_id' => ['required', 'integer', 'exists:ticket_types,id'],
            'tickets.*.quantity' => ['required', 'integer', 'min:1', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'event_id.required' => 'Мероприятие обязательно для выбора',
            'event_id.exists' => 'Выбранное мероприятие не существует',
            'email.required' => 'Email обязателен',
            'email.email' => 'Введите корректный email',
            'name.required' => 'Имя обязательно',
            'tickets.required' => 'Выберите хотя бы один билет',
            'tickets.*.quantity.max' => 'Максимум 10 билетов одного типа',
        ];
    }
}
