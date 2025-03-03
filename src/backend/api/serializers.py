from rest_framework import serializers
from stores.models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "category_id",
            "title",
            "slug",
        ]


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "product_id",
            "name",
            "description",
            "category",
            "slug",
            "image",
            "inventory",
            "price",
        ]

    category = CategorySerializer()


class ModifyProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "product_id",
            "name",
            "description",
            "category",
            "slug",
            "image",
            "inventory",
            "price",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "date_created",
            "name",
            "description",
        ]

    def create(self, validated_data):
        product_id = self.context["product_id"]
        return Review.objects.create(product_id=product_id, **validated_data)


class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["product_id", "name", "price"]


class CartitemSerializer(serializers.ModelSerializer):
    product = SimpleProductSerializer(many=False)
    sub_total = serializers.SerializerMethodField(method_name="total")

    class Meta:
        model = Cartitem
        fields = [
            "id",
            "cart",
            "product",
            "quantity",
            "sub_total",
        ]

    def total(self, cartitem: Cartitem):
        return cartitem.quantity * cartitem.product.price


class UpdateCartItemSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cartitem
        fields = ["quantity"]


class CartSerializer(serializers.ModelSerializer):
    cart_id = serializers.UUIDField(read_only=True)
    items = CartitemSerializer(many=True, read_only=True)
    grand_total = serializers.SerializerMethodField(method_name="main_total")

    class Meta:
        model = Cart
        fields = ["cart_id", "items", "grand_total"]

    def main_total(self, cart: Cart):
        items = cart.items.all()
        total = sum([item.quantity * item.product.price for item in items])
        return total


class AddCardItemSerializer(serializers.ModelSerializer):
    product_id = serializers.UUIDField()

    def save(self, **kwargs):
        cart_id = self.context["cart_id"]
        product_id = self.validated_data["product_id"]
        quantity = self.validated_data["quantity"]

        try:
            cartitem = Cartitem.objects.get(product_id=product_id, cart_id=cart_id)
            cartitem.quantity += quantity
            cartitem.save()

            self.instance = cartitem
        except:
            self.instance = Cartitem.objects.create(
                product_id=product_id,
                cart_id=cart_id,
                quantity=quantity,
            )
        return self.instance

    class Meta:
        model = Cartitem
        fields = ["id", "product_id", "quantity"]
