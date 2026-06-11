import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService, Product } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProdutos = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      showError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await productService.toggleActive(product.id, product.is_active);
      showSuccess(product.is_active ? "Produto desativado" : "Produto ativado");
      loadProducts();
    } catch (error) {
      showError("Erro ao alterar status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      showSuccess("Produto excluído com sucesso");
      loadProducts();
    } catch (error) {
      showError("Erro ao excluir produto");
    }
  };

  const handleMoveOrder = async (product: Product, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === product.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= products.length) return;
    
    const targetProduct = products[targetIndex];
    
    try {
      await Promise.all([
        productService.updateDisplayOrder(product.id, targetProduct.display_order),
        productService.updateDisplayOrder(targetProduct.id, product.display_order),
      ]);
      showSuccess("Ordem atualizada");
      loadProducts();
    } catch (error) {
      showError("Erro ao reordenar");
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      gamelabs: "bg-indigo-100 text-indigo-800",
      team: "bg-emerald-100 text-emerald-800",
    };
    const labels = {
      gamelabs: "Gamelabs",
      team: "Team",
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100"}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button onClick={() => navigate("/admin/produtos/novo")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum produto encontrado</p>
            <Button onClick={() => navigate("/admin/produtos/novo")}>
              Adicionar primeiro produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium w-16">Imagem</th>
                  <th className="px-4 py-3 text-left font-medium">Título</th>
                  <th className="px-4 py-3 text-left font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium">Preço</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium w-24">Ordem</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product, index) => (
                  <tr key={product.id} className={product.is_active ? "" : "opacity-50 bg-muted/20"}>
                    <td className="px-4 py-3">
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">—</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.title}</td>
                    <td className="px-4 py-3">{getTypeBadge(product.type)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.price || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={index === 0}
                          onClick={() => handleMoveOrder(product, 'up')}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <span className="text-xs w-5 text-center">{product.display_order}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={index === products.length - 1}
                          onClick={() => handleMoveOrder(product, 'down')}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(product)}
                          title={product.is_active ? "Desativar" : "Ativar"}
                        >
                          {product.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/produtos/${product.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{product.title}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProdutos;