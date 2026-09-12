package com.fmrent.reservations.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class FlexibleLocalDateTimeDeserializer extends StdDeserializer<LocalDateTime> {
    public FlexibleLocalDateTimeDeserializer() { super(LocalDateTime.class); }

    @Override
    public LocalDateTime deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        String value = parser.getText();
        return value.length() == 10
                ? LocalDate.parse(value).atTime(LocalTime.of(10, 0))
                : LocalDateTime.parse(value);
    }
}
