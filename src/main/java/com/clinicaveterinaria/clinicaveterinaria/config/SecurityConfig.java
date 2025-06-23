package com.clinicaveterinaria.clinicaveterinaria.config;

import com.clinicaveterinaria.clinicaveterinaria.service.AuthService; // Se você estiver injetando aqui
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Provavelmente você está injetando UsuarioService aqui:
    private final AuthService authService;

    public SecurityConfig(AuthService authService) { // AQUI é o ponto do problema
        this.authService = authService;
    }

    // Define o PasswordEncoder como um Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configura o DaoAuthenticationProvider
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(authService); // Aqui usa o usuarioService
        authProvider.setPasswordEncoder(passwordEncoder()); // Aqui usa o PasswordEncoder
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita CSRF para APIs REST
                .authorizeHttpRequests(authorize -> authorize
                        // Permite acesso ao H2 Console
                        .requestMatchers("/h2-console/**").permitAll()
                        // Outras permissões (ajuste conforme suas necessidades)
                        .requestMatchers("/auth/**").permitAll() // Ex: login, register
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // API RESTful
        return http.build();
    }
}