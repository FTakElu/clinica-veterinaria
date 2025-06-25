package com.clinicaveterinaria.clinicaveterinaria.config;

import com.clinicaveterinaria.clinicaveterinaria.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // IMPORTANTE: Habilita @PreAuthorize
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Habilita o uso de @PreAuthorize e @PostAuthorize
public class SecurityConfig {

    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // Desabilita CSRF para APIs REST
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sessão Stateless para JWT
                .authorizeHttpRequests(authorize -> authorize
                        // --- Rotas Públicas (sem autenticação/autorização) ---
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register/cliente").permitAll() // Registro de cliente é público

                        // --- Rotas Protegidas por Role ---

                        // ADMIN: Tem acesso total ao gerenciamento de usuários (incluindo secretários e outros admins)
                        // A rota /auth/register/user-with-role é específica para ADMIN criar usuários de qualquer role
                        // Rotas de CRUD de usuários (GET /usuarios, PUT/DELETE /usuarios/id)
                        .requestMatchers(HttpMethod.POST, "/auth/register/user-with-role").hasRole("ADMIN")
                        .requestMatchers("/usuarios/**").hasRole("ADMIN") // ADMIN pode gerenciar TODOS os usuários

                        // SECRETARIO: Gerencia clientes e veterinários, pets, consultas, tipos de vacina, vacinas aplicadas
                        .requestMatchers(HttpMethod.POST, "/auth/register/veterinario").hasAnyRole("ADMIN", "SECRETARIO") // SECRETARIO pode registrar Veterinários
                        .requestMatchers("/clientes/**").hasAnyRole("ADMIN", "SECRETARIO") // SECRETARIO pode gerenciar clientes
                        .requestMatchers("/pets/**").hasAnyRole("ADMIN", "SECRETARIO") // SECRETARIO pode gerenciar pets
                        .requestMatchers("/consultas/**").hasAnyRole("ADMIN", "SECRETARIO", "VETERINARIO") // Consultas podem ser vistas por SECRETARIO/VETERINARIO, agendadas por CLIENTE/SECRETARIO
                        // Ações específicas dentro de ConsultaController devem usar @PreAuthorize
                        .requestMatchers("/tipos-vacina/**").hasAnyRole("ADMIN", "SECRETARIO", "VETERINARIO") // SECRETARIO/VET gerenciam tipos, todos podem ver
                        .requestMatchers("/vacinas-aplicadas/**").hasAnyRole("ADMIN", "SECRETARIO", "VETERINARIO") // SECRETARIO/VET registram vacinas aplicadas

                        // VETERINARIO: Vê suas consultas, registra vacinas, gera relatórios
                        .requestMatchers(HttpMethod.POST, "/relatorios-consulta").hasAnyRole("ADMIN", "VETERINARIO") // Veterinário gera relatório
                        .requestMatchers(HttpMethod.PUT, "/relatorios-consulta/**").hasAnyRole("ADMIN", "VETERINARIO") // Veterinário edita relatório
                        .requestMatchers(HttpMethod.GET, "/relatorios-consulta/**").hasAnyRole("ADMIN", "SECRETARIO", "VETERINARIO", "CLIENTE") // Todos veem relatório (se tiver permissão ao ID da consulta/pet)

                        // CLIENTE: Acessa seus próprios dados, pets e consultas
                        // As rotas de CRUD de Cliente/Pet/Consulta já devem ter validação interna se o ID pertence ao user logado (no Service/Controller)
                        .requestMatchers("/meus-dados-cliente/**").hasRole("CLIENTE") // Exemplo de rota para perfil do cliente
                        .requestMatchers("/meus-pets/**").hasRole("CLIENTE")
                        .requestMatchers("/minhas-consultas/**").hasRole("CLIENTE")
                        .requestMatchers("/agendar-consulta").hasRole("CLIENTE")


                        // --- Qualquer outra requisição requer autenticação ---
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
