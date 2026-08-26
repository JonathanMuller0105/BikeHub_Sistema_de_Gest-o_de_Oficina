package br.com.projeto.bikehub.repository;

import br.com.projeto.bikehub.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * ======================================================================
 * REPOSITÓRIO: CLIENTE (br.com.projeto.bikehub.repository.ClienteRepository)
 * ======================================================================
 * Interface JPA para operações de persistência e consultas na tabela 'cliente'.
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Busca cliente pelo endereço de e-mail (usado para checagem de duplicidade).
     *
     * @param email E-mail do cliente
     * @return Optional contendo o cliente se existir
     */
    Optional<Cliente> findByEmail(String email);

    /**
     * Busca clientes ordenados alfabeticamente pelo nome para preenchimento de comboboxes.
     *
     * @return Lista de clientes em ordem alfabética
     */
    List<Cliente> findAllByOrderByNomeAsc();

    /**
     * Busca textual por termo contido no nome, e-mail ou telefone do cliente.
     * Consulta JPQL personalizada com @Query e parâmetros nomeados.
     *
     * @param termo Termo digitado na barra de pesquisa
     * @return Lista de clientes correspondentes
     */
    @Query("SELECT c FROM Cliente c WHERE " +
           "LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "c.telefone LIKE CONCAT('%', :termo, '%') " +
           "ORDER BY c.nome ASC")
    List<Cliente> pesquisarPorTermo(@Param("termo") String termo);

    /**
     * Carrega um cliente junto com suas bicicletas em uma única consulta otimizada (JOIN FETCH),
     * evitando o problema de N+1 consultas do Hibernate.
     *
     * @param id ID do cliente
     * @return Optional com o cliente e sua coleção de bicicletas inicializada
     */
    @Query("SELECT c FROM Cliente c LEFT JOIN FETCH c.bicicletas WHERE c.id = :id")
    Optional<Cliente> findByIdWithBicicletas(@Param("id") Long id);
}
