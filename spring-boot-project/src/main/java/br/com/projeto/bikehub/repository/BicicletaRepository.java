package br.com.projeto.bikehub.repository;

import br.com.projeto.bikehub.entity.Bicicleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * ======================================================================
 * REPOSITÓRIO: BICICLETA DO CLIENTE (br.com.projeto.bikehub.repository.BicicletaRepository)
 * ======================================================================
 * Interface JPA para manipulação das bicicletas particulares cadastradas pelos clientes.
 */
@Repository
public interface BicicletaRepository extends JpaRepository<Bicicleta, Long> {

    /**
     * Retorna todas as bicicletas pertencentes a um determinado cliente.
     * Utilizado para alimentar dinamicamente o select de bicicletas ao abrir uma nova OS.
     *
     * @param clienteId ID do cliente selecionado
     * @return Lista de bicicletas vinculadas àquele cliente
     */
    List<Bicicleta> findByClienteIdOrderByModeloAsc(Long clienteId);

    /**
     * Busca bicicletas filtradas por marca ou modelo.
     *
     * @param marca Nome da marca
     * @param modelo Nome do modelo
     * @return Lista de bicicletas correspondentes
     */
    List<Bicicleta> findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String marca, String modelo);

    /**
     * Consulta todas as bicicletas incluindo as informações do proprietário (JOIN FETCH).
     *
     * @return Lista de todas as bicicletas com cliente populado
     */
    @Query("SELECT b FROM Bicicleta b JOIN FETCH b.cliente ORDER BY b.marca, b.modelo")
    List<Bicicleta> findAllWithCliente();
}
